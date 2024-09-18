import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'

export default class ContactDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  edit: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await this.orderService.getOrder(orderId)

    if (order.status === 'Submitted') {
      res.redirect(`/order/${orderId}/contact-details`)
    } else {
      res.render(`pages/order/contact-details/edit`, { contactDetails: { orderId } })
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await this.orderService.getOrder(orderId)

    if (order.status === 'Draft') {
      res.redirect(`/order/${orderId}/contact-details/edit`)
    } else {
      res.render(`pages/order/contact-details/view`, { contactDetails: { orderId } })
    }
  }
}
