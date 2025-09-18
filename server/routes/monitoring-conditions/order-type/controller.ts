import { Request, RequestHandler, Response } from 'express'
import OrderTypeService from './service'

export default class OrderTypeController {
  constructor(private readonly orderTypeService: OrderTypeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/monitoring-conditions/order-type-description/order-type')
  }
}
