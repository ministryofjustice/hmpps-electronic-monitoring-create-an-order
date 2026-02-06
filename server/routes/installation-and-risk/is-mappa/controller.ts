import { Request, RequestHandler, Response } from 'express'
import MappaService from '../mappa/service'
import MappaViewModel from './viewModel'
import IsMappaFormModel from './formModel'
import TaskListService from '../../../services/taskListService'
import { isValidationResult } from '../../../models/Validation'

export default class IsMappaController {
  constructor(
    private readonly service: MappaService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = MappaViewModel.construct(order)

    res.render('pages/order/installation-and-risk/is-mappa', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = IsMappaFormModel.parse(req.body)

    const result = await this.service.updateIsMappa({
      orderId: order.id,
      data: { isMappa: data.isMappa },
      accessToken: res.locals.user.token,
    })

    if (!isValidationResult(result)) {
      order.mappa = result
      res.redirect(this.taskListService.getNextPage('IS_MAPPA', order))
    }
  }
}
