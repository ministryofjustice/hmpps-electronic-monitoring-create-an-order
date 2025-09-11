import { Request, RequestHandler, Response } from 'express'

export default class IsRejectionController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/edit/is-rejection')
  }
}
