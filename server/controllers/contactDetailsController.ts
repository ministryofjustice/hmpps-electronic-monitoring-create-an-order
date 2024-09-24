import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'

export default class ContactDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  edit: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId })

    if (order.status === 'SUBMITTED') {
      res.redirect(`/order/${orderId}/contact-details`)
    } else {
      res.render(`pages/order/contact-details/edit`, { contactDetails: { orderId } })
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId })

    if (order.status === 'IN_PROGRESS') {
      res.redirect(`/order/${orderId}/contact-details/edit`)
    } else {
      res.render(`pages/order/contact-details/view`, { contactDetails: { orderId } })
    }
  }
}
