import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import TaskListService from '../../services/taskListService'
import createViewModel from '../../models/view-models/monitoringConditionsCheckAnswers'
import OrderChecklistService from '../../services/orderChecklistService'
import SectionService from '../../services/sectionsService'

const CheckYourAnswersFormModel = z.object({
  action: z.string().default('continue'),
})

export default class CheckAnswersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
    private readonly sectionService: SectionService
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const tasks = this.taskListService.getTasks(order)
    const isNavigable = this.sectionService.checkBlankVariationOrNewOrder(tasks, order, 'ADDITIONAL_DOCUMENTS')

    res.render(`pages/order/monitoring-conditions/check-your-answers`, createViewModel(order, res.locals.content!, isNavigable))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { versionId } = req.params
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    this.checklistService.updateChecklist(`${order.id}-${order.versionId}`, 'ELECTRONIC_MONITORING_CONDITIONS')
    if (action === 'continue') {
      if (order.status === 'SUBMITTED' || order.status === 'ERROR') {
        res.redirect(
          this.taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_MONITORING_CONDITIONS', order, versionId),
        )
      } else {
        res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_MONITORING_CONDITIONS', order, {}, versionId))
      }
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
