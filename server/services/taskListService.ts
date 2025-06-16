import { Order } from '../models/Order'
import paths from '../constants/paths'
import { AddressType } from '../models/Address'
import { convertBooleanToEnum, isNotNullOrUndefined } from '../utils/utils'
import FeatureFlags from '../utils/featureFlags'

const CYA_PREFIX = 'CHECK_ANSWERS'

const SECTIONS = {
  variationDetails: 'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
  aboutTheDeviceWearer: 'ABOUT_THE_DEVICE_WEARER',
  contactInformation: 'CONTACT_INFORMATION',
  riskInformation: 'RISK_INFORMATION',
  electronicMonitoringCondition: 'ELECTRONIC_MONITORING_CONDITIONS',
  additionalDocuments: 'ADDITIONAL_DOCUMENTS',
} as const

type Section = (typeof SECTIONS)[keyof typeof SECTIONS]

const PAGES = {
  deviceWearer: 'DEVICE_WEARER',
  responsibleAdult: 'RESPONSIBLE_ADULT',
  identityNumbers: 'IDENTITY_NUMBERS',
  checkAnswersDeviceWearer: 'CHECK_ANSWERS_DEVICE_WEARER',
  contactDetails: 'CONTACT_DETAILS',
  noFixedAbode: 'NO_FIXED_ABODE',
  primaryAddress: 'PRIMARY_ADDRESS',
  secondaryAddress: 'SECONDARY_ADDRESS',
  tertiaryAddress: 'TERTIARY_ADDRESS',
  interestParties: 'INTERESTED_PARTIES',
  probationDeliveryUnit: 'PROBATION_DELIVERY_UNIT',
  checkAnswersContactInformation: 'CHECK_ANSWERS_CONTACT_INFORMATION',
  installationAndRisk: 'INSTALLATION_AND_RISK',
  checkAnswersInstallationAndRisk: 'CHECK_ANSWERS_INSTALLATION_AND_RISK',
  monitoringConditions: 'MONITORING_CONDITIONS',
  installationAddress: 'INSTALLATION_ADDRESS',
  curfewReleaseDate: 'CURFEW_RELEASE_DATE',
  curfewConditions: 'CURFEW_CONDITIONS',
  curfewTimetable: 'CURFEW_TIMETABLE',
  enforcementZoneMonitoring: 'ENFORCEMENT_ZONE_MONITORING',
  trailMonitoring: 'TRAIL_MONITORING',
  attendanceMonitoring: 'ATTENDANCE_MONITORING',
  alcoholMonitoring: 'ALCOHOL_MONITORING',
  checkAnswersMonitoringConditions: 'CHECK_ANSWERS_MONITORING_CONDITIONS',
  attachments: 'ATTACHMENTS',
  variationDetails: 'VARIATION_DETAILS',
  installationLocation: 'INSTALLATION_LOCATION',
  installationAppointment: 'INSTALLATION_APPOINTMENT',
} as const

type Page = (typeof PAGES)[keyof typeof PAGES]

const STATES = {
  required: 'REQUIRED',
  notRequired: 'NOT_REQUIRED',
  optional: 'OPTIONAL',
  cantBeStarted: 'CANT_BE_STARTED',
  disabled: 'DISABLED',
  hidden: 'HIDDEN',
} as const

type State = (typeof STATES)[keyof typeof STATES]

const COMPLETABLE_STATES: State[] = [STATES.optional, STATES.required, STATES.hidden]

export type Task = {
  section: Section
  name: Page
  path: string
  state: State
  completed: boolean
}

type SectionBlock = {
  name: Section
  completed: boolean
  path: string
}

type FormData = Record<string, string | boolean>

const canBeCompleted = (task: Task, formData: FormData): boolean => {
  if (([PAGES.secondaryAddress, PAGES.tertiaryAddress] as Page[]).includes(task.name)) {
    if (task.name === PAGES.secondaryAddress) {
      if (!(formData.hasAnotherAddress === true && formData.addressType === 'primary')) {
        return false
      }
    }
    if (task.name === PAGES.tertiaryAddress) {
      if (!(formData.hasAnotherAddress === true && formData.addressType === 'secondary')) {
        return false
      }
    }
  }

  return COMPLETABLE_STATES.includes(task.state)
}

const isCurrentPage = (task: Task, currentPage: Page): boolean => task.name === currentPage

const isCompletedAddress = (order: Order, addressType: AddressType): boolean => {
  return order.addresses.find(address => address.addressType === addressType) !== undefined
}

export default class TaskListService {
  constructor() {}

  getTasks(order: Order): Array<Task> {
    const tasks: Array<Task> = []

    tasks.push({
      section: SECTIONS.variationDetails,
      name: PAGES.variationDetails,
      path: paths.VARIATION.VARIATION_DETAILS,
      state: order.type === 'VARIATION' ? STATES.required : STATES.disabled,
      completed: isNotNullOrUndefined(order.variationDetails),
    })

    tasks.push({
      section: SECTIONS.aboutTheDeviceWearer,
      name: PAGES.deviceWearer,
      path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER,
      state: STATES.required,
      completed: isNotNullOrUndefined(order.deviceWearer.firstName),
    })

    tasks.push({
      section: SECTIONS.aboutTheDeviceWearer,
      name: PAGES.responsibleAdult,
      path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT,
      state: convertBooleanToEnum<State>(
        order.deviceWearer.adultAtTimeOfInstallation,
        STATES.cantBeStarted,
        STATES.notRequired,
        STATES.required,
      ),
      completed: isNotNullOrUndefined(order.deviceWearerResponsibleAdult),
    })

    tasks.push({
      section: SECTIONS.aboutTheDeviceWearer,
      name: PAGES.identityNumbers,
      path: paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS,
      state: STATES.optional,
      completed: isNotNullOrUndefined(order.deviceWearer.nomisId),
    })

    tasks.push({
      section: SECTIONS.aboutTheDeviceWearer,
      name: PAGES.checkAnswersDeviceWearer,
      path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS,
      state: STATES.hidden,
      completed: true,
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.contactDetails,
      path: paths.CONTACT_INFORMATION.CONTACT_DETAILS,
      state: STATES.optional,
      completed: isNotNullOrUndefined(order.contactDetails),
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.noFixedAbode,
      path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE,
      state: STATES.required,
      completed: isNotNullOrUndefined(order.deviceWearer.noFixedAbode),
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.primaryAddress,
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'primary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        STATES.cantBeStarted,
        STATES.notRequired,
        STATES.required,
      ),
      completed: isCompletedAddress(order, 'PRIMARY'),
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.secondaryAddress,
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'secondary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        STATES.cantBeStarted,
        STATES.notRequired,
        STATES.optional,
      ),
      completed: isCompletedAddress(order, 'SECONDARY'),
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.tertiaryAddress,
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'tertiary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        STATES.cantBeStarted,
        STATES.notRequired,
        STATES.optional,
      ),
      completed: isCompletedAddress(order, 'TERTIARY'),
    })

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.interestParties,
      path: paths.CONTACT_INFORMATION.INTERESTED_PARTIES,
      state: STATES.required,
      completed: isNotNullOrUndefined(order.interestedParties),
    })

    if (FeatureFlags.getInstance().get('DD_V5_1_ENABLED')) {
      tasks.push({
        section: SECTIONS.contactInformation,
        name: PAGES.probationDeliveryUnit,
        path: paths.CONTACT_INFORMATION.PROBATION_DELIVERY_UNIT,
        state: convertBooleanToEnum<State>(
          order.interestedParties?.responsibleOrganisation === 'PROBATION',
          STATES.cantBeStarted,
          STATES.required,
          STATES.notRequired,
        ),
        completed: isNotNullOrUndefined(order.probationDeliveryUnit),
      })
    }

    tasks.push({
      section: SECTIONS.contactInformation,
      name: PAGES.checkAnswersContactInformation,
      path: paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS,
      state: STATES.hidden,
      completed: true,
    })

    tasks.push({
      section: SECTIONS.riskInformation,
      name: PAGES.installationAndRisk,
      path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK,
      state: STATES.required,
      completed: isNotNullOrUndefined(order.installationAndRisk),
    })

    tasks.push({
      section: SECTIONS.riskInformation,
      name: PAGES.checkAnswersInstallationAndRisk,
      path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
      state: STATES.required,
      completed: true,
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.monitoringConditions,
      path: paths.MONITORING_CONDITIONS.BASE_URL,
      state: STATES.required,
      completed: order.monitoringConditions.isValid,
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.installationLocation,
      path: paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION,
      state: STATES.required,
      completed: isNotNullOrUndefined(order.installationLocation),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.installationAppointment,
      path: paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT,
      state: convertBooleanToEnum<State>(
        order.installationLocation?.location === 'PRISON' ||
          order.installationLocation?.location === 'PROBATION_OFFICE',
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.installationAppointment),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.installationAddress,
      path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', 'installation'),
      state: convertBooleanToEnum<State>(
        order.installationLocation?.location === 'INSTALLATION' ||
          order.installationLocation?.location === 'PRISON' ||
          order.installationLocation?.location === 'PROBATION_OFFICE',
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isCompletedAddress(order, 'INSTALLATION'),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.curfewReleaseDate,
      path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.curfewReleaseDateConditions),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.curfewConditions,
      path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.curfewConditions),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.curfewTimetable,
      path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.curfewTimeTable) && order.curfewTimeTable.length > 0,
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.enforcementZoneMonitoring,
      path: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0'),
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.exclusionZone,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: order.enforcementZoneConditions.length > 0,
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.trailMonitoring,
      path: paths.MONITORING_CONDITIONS.TRAIL,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.trail,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.monitoringConditionsTrail),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.attendanceMonitoring,
      path: paths.MONITORING_CONDITIONS.ATTENDANCE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.mandatoryAttendance,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed:
        isNotNullOrUndefined(order.mandatoryAttendanceConditions) && order.mandatoryAttendanceConditions.length > 0,
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.alcoholMonitoring,
      path: paths.MONITORING_CONDITIONS.ALCOHOL,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.alcohol,
        STATES.cantBeStarted,
        STATES.required,
        STATES.notRequired,
      ),
      completed: isNotNullOrUndefined(order.monitoringConditionsAlcohol),
    })

    tasks.push({
      section: SECTIONS.electronicMonitoringCondition,
      name: PAGES.checkAnswersMonitoringConditions,
      path: paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS,
      state: STATES.hidden,
      completed: true,
    })

    tasks.push({
      section: SECTIONS.additionalDocuments,
      name: PAGES.attachments,
      path: paths.ATTACHMENT.ATTACHMENTS,
      state: STATES.optional,
      completed: false,
    })

    return tasks
  }

  getNextPage(currentPage: Page, order: Order, formData: FormData = {}): string {
    const tasks = this.getTasks(order)
    const section = this.getCurrentSection(tasks, currentPage)
    const sectionTasks = tasks.filter(task => task.section === section)

    if (currentPage.startsWith(CYA_PREFIX) || currentPage === PAGES.variationDetails) {
      const availableTasks = tasks.filter(task => canBeCompleted(task, formData) || isCurrentPage(task, currentPage))
      const currentTaskIndex = availableTasks.findIndex(({ name }) => name === currentPage)
      return availableTasks[currentTaskIndex + 1].path.replace(':orderId', order.id)
    }
    const availableTasks = sectionTasks.filter(
      task => (canBeCompleted(task, formData) && this.incompleteTask(task)) || isCurrentPage(task, currentPage),
    )
    const currentTaskIndex = availableTasks.findIndex(({ name }) => name === currentPage)

    if (currentTaskIndex === -1 || currentTaskIndex + 1 >= availableTasks.length) {
      return paths.ORDER.SUMMARY.replace(':orderId', order.id)
    }

    return availableTasks[currentTaskIndex + 1].path.replace(':orderId', order.id)
  }

  getSectionCheckAnswers(sectionTasks: Task[]): Task {
    return sectionTasks.find(task => task.name.startsWith(CYA_PREFIX))!
  }

  getCurrentSection(tasks: Task[], currentPage: Page): Section {
    return tasks.find(task => task.name === currentPage)!.section
  }

  getNextCheckYourAnswersPage(currentPage: Page, order: Order) {
    const tasks = this.getTasks(order)

    const checkYourAnswersTasks = tasks.filter(
      task => canBeCompleted(task, {}) && task.path.includes('check-your-answers'),
    )

    const currentTaskIndex = checkYourAnswersTasks.findIndex(task => task.name === currentPage)

    if (currentTaskIndex === -1 || currentTaskIndex + 1 >= checkYourAnswersTasks.length) {
      return paths.ORDER.SUMMARY.replace(':orderId', order.id)
    }

    return checkYourAnswersTasks[currentTaskIndex + 1].path.replace(':orderId', order.id)
  }

  findTaskBySection(tasks: Task[], section: Section): Task[] {
    return tasks.filter(task => task.section === section)
  }

  isSectionComplete(tasks: Task[]): boolean {
    return tasks.every(task => (canBeCompleted(task, {}) ? task.completed : true))
  }

  incompleteTask(task: Task): boolean {
    return !task.completed || task.name.startsWith(CYA_PREFIX)
  }

  getSections(order: Order): SectionBlock[] {
    const tasks = this.getTasks(order)

    return Object.values(SECTIONS)
      .filter(section => section !== SECTIONS.variationDetails || order.type === 'VARIATION')
      .map(section => {
        const sectionsTasks = this.findTaskBySection(tasks, section)
        const completed = this.isSectionComplete(sectionsTasks)
        let { path } = sectionsTasks[0]
        if (order.status === 'SUBMITTED' || completed) {
          path = this.getCheckYourAnswerPathForSection(sectionsTasks)
        }
        return { name: section, completed, path: path.replace(':orderId', order.id) }
      })
  }

  getCheckYourAnswerPathForSection = (sectionTasks: Task[]) => {
    return (sectionTasks.find(task => task.path.includes('check-your-answers')) || sectionTasks[0]).path
  }
}

export { Page }
