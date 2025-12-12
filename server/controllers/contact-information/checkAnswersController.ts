import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import TaskListService from '../../services/taskListService'
import createViewModel from '../../models/view-models/contactInformationCheckAnswers'
import OrderChecklistService from '../../services/orderChecklistService'

const CheckYourAnswersFormModel = z.object({
  action: z.string().default('continue'),
})

export default class CheckAnswersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    res.render(`pages/order/contact-information/check-your-answers`, createViewModel(order, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { versionId } = req.params
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    this.checklistService.updateChecklist(`${order.id}-${order.versionId}`, 'CONTACT_INFORMATION')
    if (action === 'continue') {
      if (order.status === 'SUBMITTED' || order.status === 'ERROR') {
        res.redirect(
          this.taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_CONTACT_INFORMATION', order, versionId),
        )
      } else {
        res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_CONTACT_INFORMATION', order, {}, versionId))
      }
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
