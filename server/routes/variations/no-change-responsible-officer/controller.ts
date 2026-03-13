import { Request, RequestHandler, Response } from 'express'

export default class NoChangeResponsibleOfficerController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
 
    res.render('pages/order/variation/no-change-responsible-officer',{orderId: req.order?.id})
  }
}
