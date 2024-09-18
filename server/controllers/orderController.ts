import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  summary: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    const order = await this.orderService.getOrder(id)

    res.render('pages/order/summary', {
      order,
    })
  }
}
