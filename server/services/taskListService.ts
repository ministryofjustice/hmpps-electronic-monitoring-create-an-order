import { Order } from '../models/Order'
import paths from '../constants/paths'

type Section =
  | 'ABOUT_THE_DEVICE_WEARER'
  | 'CONTACT_INFORMATION'
  | 'INSTALLATION_AND_RISK'
  | 'MONITORING_CONDITIONS'
  | 'ATTACHMENTS'

type Page =
  | 'DEVICE_WEARER'
  | 'RESPONSIBLE_ADULT'
  | 'CONTACT_DETAILS'
  | 'NO_FIXED_ABODE'
  | 'PRIMARY_ADDRESS'
  | 'SECONDARY_ADDRESS'
  | 'TERTIARY_ADDRESS'
  | 'NOTIFYING_ORGANISATION'
  | 'INSTALLATION_AND_RISK'
  | 'MONITORING_CONDITIONS'
  | 'INSTALLATION_ADDRESS'
  | 'CURFEW_RELEASE_DATE'
  | 'CURFEW_CONDITIONS'
  | 'CURFEW_TIMETABLE'
  | 'ZONE'
  | 'TRAIL'
  | 'ATTENDANCE'
  | 'ALCOHOL'
  | 'ATTACHMENT'

type Task = {
  section: Section
  name: Page
  path: string
  required: boolean
  status: 'INCOMPLETE' | 'COMPLETE'
}

type TasksBySections = {
  [k in Section]: Array<Task>
}

type FormData = Record<string, string | boolean>

export default class TaskListService {
  constructor() {}

  getTasks(order: Order, formData: FormData = {}): Array<Task> {
    const tasks: Array<Task> = []

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'DEVICE_WEARER',
      path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'ABOUT_THE_DEVICE_WEARER',
      name: 'RESPONSIBLE_ADULT',
      path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT,
      required: !order.deviceWearer.adultAtTimeOfInstallation,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'CONTACT_DETAILS',
      path: paths.CONTACT_INFORMATION.CONTACT_DETAILS,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'NO_FIXED_ABODE',
      path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'PRIMARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'primary'),
      required: !order.deviceWearer.noFixedAbode,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'SECONDARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'secondary'),
      required: formData.hasAnotherAddress === true && formData.addressType === 'primary',
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'TERTIARY_ADDRESS',
      path: paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'tertiary'),
      required: formData.hasAnotherAddress === true && formData.addressType === 'secondary',
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'CONTACT_INFORMATION',
      name: 'NOTIFYING_ORGANISATION',
      path: paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'INSTALLATION_AND_RISK',
      name: 'INSTALLATION_AND_RISK',
      path: paths.INSTALLATION_AND_RISK,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'MONITORING_CONDITIONS',
      path: paths.MONITORING_CONDITIONS.BASE_URL,
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'INSTALLATION_ADDRESS',
      path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', 'installation'),
      required: true,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'CURFEW_RELEASE_DATE',
      path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE,
      required: !!order.monitoringConditions.curfew,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'CURFEW_CONDITIONS',
      path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS,
      required: !!order.monitoringConditions.curfew,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'CURFEW_TIMETABLE',
      path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE,
      required: !!order.monitoringConditions.curfew,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'ZONE',
      path: paths.MONITORING_CONDITIONS.ZONE,
      required: !!order.monitoringConditions.exclusionZone,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'TRAIL',
      path: paths.MONITORING_CONDITIONS.TRAIL,
      required: !!order.monitoringConditions.trail,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'ATTENDANCE',
      path: paths.MONITORING_CONDITIONS.ATTENDANCE,
      required: !!order.monitoringConditions.mandatoryAttendance,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'MONITORING_CONDITIONS',
      name: 'ALCOHOL',
      path: paths.MONITORING_CONDITIONS.ALCOHOL,
      required: !!order.monitoringConditions.alcohol,
      status: 'INCOMPLETE',
    })

    tasks.push({
      section: 'ATTACHMENTS',
      name: 'ATTACHMENT',
      path: paths.ATTACHMENT.ATTACHMENTS,
      required: true,
      status: 'INCOMPLETE',
    })

    return tasks
  }

  getNextPage(currentPage: Page, order: Order, formData: FormData = {}) {
    const tasks = this.getTasks(order, formData)
    const requiredTasks = tasks.filter(({ name, required }) => required || name === currentPage)
    const currentTaskIndex = requiredTasks.findIndex(({ name }) => name === currentPage)

    if (currentTaskIndex === -1 || currentTaskIndex + 1 >= requiredTasks.length) {
      return paths.ORDER.SUMMARY.replace(':orderId', order.id)
    }

    return requiredTasks[currentTaskIndex + 1].path.replace(':orderId', order.id)
  }

  getTasksBySection(order: Order) {
    const tasks = this.getTasks(order)
    return tasks.reduce((acc, task) => {
      if (!acc[task.section]) {
        acc[task.section] = []
      }

      acc[task.section].push({
        ...task,
        path: task.path.replace(':orderId', order.id),
      })

      return acc
    }, {} as TasksBySections)
  }
}

export { Page }
