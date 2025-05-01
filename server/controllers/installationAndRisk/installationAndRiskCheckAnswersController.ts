import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import createViewModel from '../../models/view-models/riskInformationCheckAnswers'

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
    const uri = paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id)

    res.render(`pages/order/installation-and-risk/check-your-answers`, {
      riskInformation: createViewModel(order, res.locals.content!, uri),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    if (action === 'continue') {
      if (order.status === 'SUBMITTED') {
        res.redirect(this.taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_INSTALLATION_AND_RISK', order))
      } else {
        res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_INSTALLATION_AND_RISK', order))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }
}
