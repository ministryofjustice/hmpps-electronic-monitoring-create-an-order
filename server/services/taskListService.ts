import { Order } from '../models/Order'
import paths from '../constants/paths'
import { AddressType } from '../models/Address'
import { convertBooleanToEnum, isNotNullOrUndefined } from '../utils/utils'

const SECTIONS = [
  'ABOUT_THE_DEVICE_WEARER',
  'CONTACT_INFORMATION',
  'RISK_INFORMATION',
  'ELECTRONIC_MONITORING_CONDITIONS',
  'ADDITIONAL_DOCUMENTS',
  'VARIATION_DETAILS',
] as const

type Section = (typeof SECTIONS)[number]

type Page =
  | 'DEVICE_WEARER'
  | 'RESPONSIBLE_ADULT'
  | 'IDENTITY_NUMBERS'
  | 'CHECK_ANSWERS_DEVICE_WEARER'
  | 'CONTACT_DETAILS'
  | 'NO_FIXED_ABODE'
  | 'PRIMARY_ADDRESS'
  | 'SECONDARY_ADDRESS'
  | 'TERTIARY_ADDRESS'
  | 'INTERESTED_PARTIES'
  | 'CHECK_ANSWERS_CONTACT_INFORMATION'
  | 'INSTALLATION_AND_RISK'
  | 'MONITORING_CONDITIONS'
  | 'INSTALLATION_ADDRESS'
  | 'CURFEW_RELEASE_DATE'
  | 'CURFEW_CONDITIONS'
  | 'CURFEW_TIMETABLE'
  | 'ENFORCEMENT_ZONE_MONITORING'
  | 'TRAIL_MONITORING'
  | 'ATTENDANCE_MONITORING'
  | 'ALCOHOL_MONITORING'
  | 'CHECK_ANSWERS_MONITORING_CONDITIONS'
  | 'ATTACHMENTS'
  | 'VARIATION_DETAILS'

type State = 'REQUIRED' | 'NOT_REQUIRED' | 'OPTIONAL' | 'CANT_BE_STARTED' | 'DISABLED' | 'HIDDEN'

type Task = {
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
  if (['SECONDARY_ADDRESS', 'TERTIARY_ADDRESS'].includes(task.name)) {
    if (task.name === 'SECONDARY_ADDRESS') {
      if (!(formData.hasAnotherAddress === true && formData.addressType === 'primary')) {
        return false
      }
    }
    if (task.name === 'TERTIARY_ADDRESS') {
      if (!(formData.hasAnotherAddress === true && formData.addressType === 'secondary')) {
        return false
      }
    }
  }

  return ['OPTIONAL', 'REQUIRED', 'HIDDEN'].includes(task.state)
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
      section: 'VARIATION_DETAILS',
      name: 'VARIATION_DETAILS',
      path: paths.VARIATION.VARIATION_DETAILS,
      state: order.type === 'VARIATION' ? 'REQUIRED' : 'DISABLED',
      completed: isNotNullOrUndefined(order.variationDetails),
    })

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'DEVICE_WEARER',
      path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER,
      state: 'REQUIRED',
      completed: isNotNullOrUndefined(order.deviceWearer.firstName),
    })

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'RESPONSIBLE_ADULT',
      path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT,
      state: convertBooleanToEnum<State>(
        order.deviceWearer.adultAtTimeOfInstallation,
        'CANT_BE_STARTED',
        'NOT_REQUIRED',
        'REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.deviceWearerResponsibleAdult),
    })

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'IDENTITY_NUMBERS',
      path: paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS,
      state: 'OPTIONAL',
      completed: isNotNullOrUndefined(order.deviceWearer.nomisId),
    })

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'CHECK_ANSWERS_DEVICE_WEARER',
      path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS,
      state: 'HIDDEN',
      completed: true,
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'CONTACT_DETAILS',
      path: paths.CONTACT_INFORMATION.CONTACT_DETAILS,
      state: 'OPTIONAL',
      completed: isNotNullOrUndefined(order.contactDetails),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'NO_FIXED_ABODE',
      path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE,
      state: 'REQUIRED',
      completed: isNotNullOrUndefined(order.deviceWearer.noFixedAbode),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'PRIMARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'primary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        'CANT_BE_STARTED',
        'NOT_REQUIRED',
        'REQUIRED',
      ),
      completed: isCompletedAddress(order, 'PRIMARY'),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'SECONDARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'secondary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        'CANT_BE_STARTED',
        'NOT_REQUIRED',
        'OPTIONAL',
      ),
      completed: isCompletedAddress(order, 'SECONDARY'),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'TERTIARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'tertiary'),
      state: convertBooleanToEnum<State>(
        order.deviceWearer.noFixedAbode,
        'CANT_BE_STARTED',
        'NOT_REQUIRED',
        'OPTIONAL',
      ),
      completed: isCompletedAddress(order, 'TERTIARY'),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'INTERESTED_PARTIES',
      path: paths.CONTACT_INFORMATION.INTERESTED_PARTIES,
      state: 'REQUIRED',
      completed: isNotNullOrUndefined(order.interestedParties),
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'CHECK_ANSWERS_CONTACT_INFORMATION',
      path: paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS,
      state: 'HIDDEN',
      completed: true,
    })

    tasks.push({
      section: 'RISK_INFORMATION',
      name: 'INSTALLATION_AND_RISK',
      path: paths.INSTALLATION_AND_RISK,
      state: 'REQUIRED',
      completed: isNotNullOrUndefined(order.installationAndRisk),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'MONITORING_CONDITIONS',
      path: paths.MONITORING_CONDITIONS.BASE_URL,
      state: 'REQUIRED',
      completed: order.monitoringConditions.isValid,
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'INSTALLATION_ADDRESS',
      path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', 'installation'),
      state: 'REQUIRED',
      completed: isCompletedAddress(order, 'INSTALLATION'),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'CURFEW_RELEASE_DATE',
      path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.curfewReleaseDateConditions),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'CURFEW_CONDITIONS',
      path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.curfewConditions),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'CURFEW_TIMETABLE',
      path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.curfew,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.curfewTimeTable) && order.curfewTimeTable.length > 0,
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'ENFORCEMENT_ZONE_MONITORING',
      path: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0'),
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.exclusionZone,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: order.enforcementZoneConditions.length > 0,
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'TRAIL_MONITORING',
      path: paths.MONITORING_CONDITIONS.TRAIL,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.trail,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.monitoringConditionsTrail),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'ATTENDANCE_MONITORING',
      path: paths.MONITORING_CONDITIONS.ATTENDANCE,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.mandatoryAttendance,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed:
        isNotNullOrUndefined(order.mandatoryAttendanceConditions) && order.mandatoryAttendanceConditions.length > 0,
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'ALCOHOL_MONITORING',
      path: paths.MONITORING_CONDITIONS.ALCOHOL,
      state: convertBooleanToEnum<State>(
        order.monitoringConditions.alcohol,
        'CANT_BE_STARTED',
        'REQUIRED',
        'NOT_REQUIRED',
      ),
      completed: isNotNullOrUndefined(order.monitoringConditionsAlcohol),
    })

    tasks.push({
      section: 'ELECTRONIC_MONITORING_CONDITIONS',
      name: 'CHECK_ANSWERS_MONITORING_CONDITIONS',
      path: paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS,
      state: 'HIDDEN',
      completed: true,
    })

    tasks.push({
      section: 'ADDITIONAL_DOCUMENTS',
      name: 'ATTACHMENTS',
      path: paths.ATTACHMENT.ATTACHMENTS,
      state: 'OPTIONAL',
      completed: false,
    })

    return tasks
  }

  getNextPage(currentPage: Page, order: Order, formData: FormData = {}) {
    const tasks = this.getTasks(order)
    const availableTasks = tasks.filter(task => canBeCompleted(task, formData) || isCurrentPage(task, currentPage))
    const currentTaskIndex = availableTasks.findIndex(({ name }) => name === currentPage)

    if (currentTaskIndex === -1 || currentTaskIndex + 1 >= availableTasks.length) {
      return paths.ORDER.SUMMARY.replace(':orderId', order.id)
    }

    return availableTasks[currentTaskIndex + 1].path.replace(':orderId', order.id)
  }

  findTaskBySection(tasks: Task[], section: Section): Task[] {
    return tasks.filter(task => task.section === section)
  }

  isSectionComplete(tasks: Task[]): boolean {
    return tasks.every(task => (canBeCompleted(task, {}) ? task.completed : true))
  }

  getSections(order: Order): SectionBlock[] {
    const tasks = this.getTasks(order)

    return SECTIONS.filter(section => section !== 'VARIATION_DETAILS' || order.type === 'VARIATION').map(section => {
      const sectionsTasks = this.findTaskBySection(tasks, section)
      const completed = this.isSectionComplete(sectionsTasks)
      return { name: section, completed, path: sectionsTasks[0].path.replace(':orderId', order.id) }
    })
  }
}

export { Page }
