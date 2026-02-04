import { Request, RequestHandler, Response } from 'express'
import MappaService from '../mappa/service'

export default class IsMappaController {
  constructor(private readonly service: MappaService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/installation-and-risk/is-mappa', {})
  }
}
