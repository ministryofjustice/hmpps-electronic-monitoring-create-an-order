import { Request, RequestHandler, Response } from 'express'

export default class NoRefitsController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/variation/no-refits')
  }
}
