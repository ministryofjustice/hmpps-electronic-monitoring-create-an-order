import { Order } from '../../models/Order'
import TaskListService, { canBeCompleted, Task } from '../../services/taskListService'

const SECTIONS = {
  interestParties: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
  aboutTheDeviceWearer: 'ABOUT_THE_DEVICE_WEARER',
  riskInformation: 'RISK_INFORMATION',
  electronicMonitoringCondition: 'ELECTRONIC_MONITORING_CONDITIONS',
  additionalDocuments: 'ADDITIONAL_DOCUMENTS',
  variationDetails: 'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
} as const

export type SectionName = (typeof SECTIONS)[keyof typeof SECTIONS]

export type TaskSection = {
  name: SectionName
  completed: boolean
  path: string
  isReady: boolean
}

export default class SectionListService {
  constructor(private readonly taskListService: TaskListService) {}

  getSectionsForOrder(order: Order): TaskSection[] {
    const sections: SectionName[] = [
      SECTIONS.aboutTheDeviceWearer,
      SECTIONS.riskInformation,
      SECTIONS.electronicMonitoringCondition,
      SECTIONS.additionalDocuments,
    ]

    const startDate = order.monitoringConditions.startDate
      ? new Date(order.monitoringConditions.startDate)
      : new Date(1900, 0, 0)
    const startDateIsInFuture = startDate > new Date()

    if (order.interestedParties?.notifyingOrganisation !== 'HOME_OFFICE' && startDateIsInFuture) {
      sections.push(SECTIONS.interestParties)
    }

    const tasks = this.taskListService.getTasks(order)
    return sections.map(section => this.getDetailsForSection(section, tasks, order))
  }

  private getDetailsForSection(section: SectionName, tasks: Task[], order: Order): TaskSection {
    const sectionsTasks = tasks.filter(task => task.section === section)
    const completed = this.isSectionComplete(sectionsTasks, order, section)
    return {
      name: section,
      completed,
      path: '',
      isReady: this.isSectionReady(section, tasks, order),
    }
  }

  private isSectionComplete(tasks: Task[], order: Order, section: SectionName): boolean {
    const tasksCompleted = tasks.every(task => (canBeCompleted(task, {}) ? task.completed : true))
    //
    // if (section === SECTIONS.electronicMonitoringCondition) {
    //   const anyConditionCompleted =
    //     order.monitoringConditionsAlcohol?.startDate !== undefined ||
    //     order.curfewConditions?.startDate !== undefined ||
    //     order.monitoringConditionsTrail?.startDate !== undefined ||
    //     order.enforcementZoneConditions?.length !== 0 ||
    //     order.mandatoryAttendanceConditions?.length !== 0
    //   return tasksCompleted && anyConditionCompleted
    // }

    return tasksCompleted
  }

  private isSectionReady(section: SectionName, tasks: Task[], order: Order): boolean {
    if (section === SECTIONS.electronicMonitoringCondition) {
      const deviceWearerTasks = tasks.filter(task => task.section === section)
      return this.isSectionComplete(deviceWearerTasks, order, SECTIONS.aboutTheDeviceWearer)
    }
    return true
  }
}
