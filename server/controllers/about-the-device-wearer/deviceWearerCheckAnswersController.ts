import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import createViewModel from '../../models/view-models/deviceWearerCheckAnswers'
import TaskListService from '../../services/taskListService'
import OrderChecklistService from '../../services/orderChecklistService'

const CheckYourAnswersFormModel = z.object({
  action: z.string().default('continue'),
})

export default class DeviceWearerCheckAnswersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render(`pages/order/about-the-device-wearer/check-your-answers`, createViewModel(order, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { versionId } = req.params
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    await this.checklistService.updateChecklist(`${order.id}-${order.versionId}`, 'ABOUT_THE_DEVICE_WEARER')
    if (action === 'continue') {
      if (order.status === 'SUBMITTED' || order.status === 'ERROR') {
        res.redirect(this.taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_DEVICE_WEARER', order, versionId))
      } else {
        res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_DEVICE_WEARER', order, {}, versionId))
      }
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
