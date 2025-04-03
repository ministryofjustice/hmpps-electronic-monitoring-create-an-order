import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { AuditService } from '../../services'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import createViewModel from '../../models/view-models/contactInformationCheckAnswers'

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
    res.render(`pages/order/contact-information/check-your-answers`, createViewModel(order, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_CONTACT_INFORMATION', order))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }
}
