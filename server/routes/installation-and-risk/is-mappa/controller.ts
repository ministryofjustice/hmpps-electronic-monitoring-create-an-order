import { Request, RequestHandler, Response } from 'express'
import MappaService from '../mappa/service'
import MappaViewModel from './viewModel'

export default class IsMappaController {
  constructor(private readonly service: MappaService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const model = MappaViewModel.construct(order)

    res.render('pages/order/installation-and-risk/is-mappa', model)
  }
}
