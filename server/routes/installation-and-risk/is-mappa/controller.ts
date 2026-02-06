import { Request, RequestHandler, Response } from 'express'
import MappaService from '../mappa/service'
import IsMappaViewModel from './viewModel'
import IsMappaFormModel from './formModel'
import TaskListService from '../../../services/taskListService'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import paths from '../../../constants/paths'

export default class IsMappaController {
  constructor(
    private readonly service: MappaService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const model = IsMappaViewModel.construct(order, errors)

    res.render('pages/order/installation-and-risk/is-mappa', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const formData = IsMappaFormModel.parse(req.body)

    const result = await this.service.updateIsMappa({
      orderId: order.id,
      data: { isMappa: formData.isMappa },
      accessToken: res.locals.user.token,
    })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)

      res.redirect(paths.INSTALLATION_AND_RISK.IS_MAPPA.replace(':orderId', order.id))
      return
    }

    if (formData.action === 'continue') {
      order.mappa = result
      res.redirect(this.taskListService.getNextPage('IS_MAPPA', order))
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
