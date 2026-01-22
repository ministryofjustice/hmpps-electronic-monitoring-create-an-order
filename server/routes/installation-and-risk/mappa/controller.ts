import { Request, RequestHandler, Response } from 'express'

export default class MappaController {
  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/installation-and-risk/mappa')
  }
}
