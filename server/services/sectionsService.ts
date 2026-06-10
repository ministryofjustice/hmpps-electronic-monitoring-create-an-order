import { Order } from '../models/Order'
import isVariationType from '../utils/isVariationType'
import { isNotNullOrEmptyString } from '../utils/utils'
import OrderChecklistService from './orderChecklistService'
import TaskListService, { canBeCompleted, Task } from './taskListService'

const SECTIONS = {
  interestedParties: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
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
  checked: boolean
}

export default class SectionService {
  constructor(
    private readonly taskListService: TaskListService,
    private readonly checkListService: OrderChecklistService,
  ) {}

  async getSectionsForOrder(order: Order, version?: string): Promise<TaskSection[]> {
    const sections = this.getRelevantSections(order)
    const tasks = this.taskListService.getTasks(order)

    const checkList = await this.checkListService.getChecklist(`${order.id}-${order.versionId}`)
    return sections.map(section => this.getDetailsForSection(section, tasks, order, checkList, version))
  }

  private getRelevantSections(order: Order): SectionName[] {
    let sections: SectionName[] = [
      SECTIONS.aboutTheDeviceWearer,
      SECTIONS.riskInformation,
      SECTIONS.electronicMonitoringCondition,
      SECTIONS.additionalDocuments,
    ]

    if (this.shouldShowInterestedParties(order)) {
      sections = [SECTIONS.interestedParties, ...sections]
    }

    if (isVariationType(order.type)) {
      sections.push(SECTIONS.variationDetails)
    }

    return sections
  }

  private getDetailsForSection(
    sectionName: SectionName,
    tasks: Task[],
    order: Order,
    checkList: Record<string, boolean>,
    versionId?: string,
  ): TaskSection {
    const sectionTasks = tasks.filter(task => task.section === sectionName)

    const completed = this.isSectionComplete(sectionTasks, order, sectionName)

    let path: string

    if (completed) {
      path = this.taskListService.getCheckYourAnswersPathForSection(sectionTasks).replace(':orderId', order.id)
      if (versionId) {
        path = path.replace(`order/${order.id}`, `order/${order.id}/version/${versionId}`)
      }
    } else {
      path = this.taskListService.getNextTaskPath(sectionTasks, order.id, versionId)
    }

    return {
      name: sectionName,
      completed,
      checked: checkList[sectionName],
      path,
      isReady: this.isSectionReady(sectionName, tasks, order),
    }
  }

  private isSectionComplete(tasks: Task[], order: Order, section: SectionName): boolean {
    const tasksCompleted = tasks.every(task => (canBeCompleted(task, {}) ? task.completed : true))

    if (section === SECTIONS.electronicMonitoringCondition) {
      const anyConditionCompleted =
        order.monitoringConditionsAlcohol?.startDate !== undefined ||
        order.curfewConditions?.startDate !== undefined ||
        order.monitoringConditionsTrail?.startDate !== undefined ||
        (order.enforcementZoneConditions?.length ?? 0) !== 0 ||
        (order.mandatoryAttendanceConditions?.length ?? 0) !== 0
      return tasksCompleted && anyConditionCompleted
    }

    return tasksCompleted
  }

  private isSectionReady(section: SectionName, tasks: Task[], order: Order): boolean {
    if (section === SECTIONS.electronicMonitoringCondition) {
      const deviceWearerTasks = tasks.filter(task => task.section === 'ABOUT_THE_DEVICE_WEARER')
      return this.isSectionComplete(deviceWearerTasks, order, SECTIONS.aboutTheDeviceWearer)
    }
    return true
  }

  private shouldShowInterestedParties(order: Order): boolean {
    const startDate = order.monitoringConditions.startDate
      ? new Date(order.monitoringConditions.startDate)
      : new Date(2040, 0, 0)
    const startDateIsInFuture = startDate >= new Date()

    // Return early for disallowed organisation
    if (order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE') {
      return false
    }

    // Non-variation types are always allowed
    if (!isVariationType(order.type)) {
      return true
    }

    // Allowed when submitted with required interested party info
    const hasInterestedPartyInfo =
      isNotNullOrEmptyString(order.interestedParties?.responsibleOfficerFirstName) ||
      isNotNullOrEmptyString(order.interestedParties?.responsibleOfficerName) ||
      isNotNullOrEmptyString(order.interestedParties?.responsibleOrganisation)

    if (order.status === 'SUBMITTED' && hasInterestedPartyInfo) {
      return true
    }

    // Past start date blocks the flow
    if (startDateIsInFuture) {
      return true
    }

    return false
  }
}
