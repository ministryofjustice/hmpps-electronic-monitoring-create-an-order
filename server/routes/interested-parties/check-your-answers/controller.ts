import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import ViewModel from './viewModel'
import TaskListService from '../../../services/taskListService'
import { OrderChecklistService } from '../../../services'

const CheckYourAnswersFormModel = z.object({
  action: z.string().default('continue'),
})

export default class InterestedPartiesCheckYourAnswersController {
  constructor(
    private readonly taskListService: TaskListService,
    private readonly checklistService: OrderChecklistService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render(
      'pages/order/interested-parties/check-your-answers',
      ViewModel.construct(req.order!, res.locals.content!),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { versionId } = req.params
    const { action } = CheckYourAnswersFormModel.parse(req.body)

    this.checklistService.updateChecklist(`${order.id}-${order.versionId}`, 'ELECTRONIC_MONITORING_CONDITIONS')
    if (action === 'continue') {
      if (order.status === 'SUBMITTED' || order.status === 'ERROR') {
        res.redirect(
          this.taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_INTERESTED_PARTIES', order, versionId),
        )
      } else {
        res.redirect(this.taskListService.getNextPage('CHECK_ANSWERS_INTERESTED_PARTIES', order, {}, versionId))
      }
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
