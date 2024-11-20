import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import createViewModel from '../../models/view-models/monitoringConditionsCheckAnswers'

const CheckYourAnswersFormModel = z.object({
  action: z.string().default('continue'),
})

export default class CheckAnswersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render(`pages/order/monitoring-conditions/check-your-answers`, createViewModel(order))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_MONITORING_CONDITIONS', order))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }
}
