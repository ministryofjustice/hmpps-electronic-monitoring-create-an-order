import { Request, RequestHandler, Response } from 'express'
import OrderTypeService from './service'

export default class OrderTypeController {
  constructor(private readonly orderTypeService: OrderTypeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    // random page for now
    res.render('pages/order/edit/is-rejection')
  }
}
