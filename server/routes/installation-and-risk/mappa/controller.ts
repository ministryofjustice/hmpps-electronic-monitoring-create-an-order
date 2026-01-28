import { Request, RequestHandler, Response } from 'express'
import ViewModel from './viewModel'
import MappaFormModel from './formModel'
import MappaService from './service'
import paths from '../../../constants/paths'

export default class MappaController {
  constructor(private readonly service: MappaService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = ViewModel.construct(order)
    res.render('pages/order/installation-and-risk/mappa', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const data = MappaFormModel.parse(req.body)

    await this.service.updateMappa({
      orderId: order.id,
      data: { level: data.level, category: data.category },
      accessToken: res.locals.user.token,
    })

    if (data.action === 'continue') {
      res.redirect(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    } else {
      res.redirect(res.locals.orderSummaryUri)
    }
  }
}
