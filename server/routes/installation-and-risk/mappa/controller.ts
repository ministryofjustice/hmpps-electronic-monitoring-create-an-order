import { Request, RequestHandler, Response } from 'express'
import ViewModel from './viewModel'
import MappaFormModel, { MappaInput } from './formModel'
import MappaService from './service'
import paths from '../../../constants/paths'
import { isValidationResult, ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'

export default class MappaController {
  constructor(
    private readonly service: MappaService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as MappaInput[]

    const model = ViewModel.construct(order, formData[0], errors)
    res.render('pages/order/installation-and-risk/mappa', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = MappaFormModel.parse(req.body)

    const result = await this.service.updateMappa({
      orderId: order.id,
      data: { level: data.level, category: data.category },
      accessToken: res.locals.user.token,
    })

    if (isValidationResult(result)) {
      req.flash('validationErrors', result)
      req.flash('formData', data)

      res.redirect(paths.INSTALLATION_AND_RISK.MAPPA.replace(':orderId', order.id))
      return
    }

    if (data.action === 'continue') {
      order.mappa = result
      res.redirect(this.taskListService.getNextPage('MAPPA', order))
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
