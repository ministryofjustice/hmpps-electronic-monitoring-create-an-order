import { Request, RequestHandler, Response } from 'express'
import ViewModel from './viewModel'

export default class MappaController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = ViewModel.construct(order)
    res.render('pages/order/installation-and-risk/mappa', model)
  }
}
