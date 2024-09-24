import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    const { user } = res.locals
    const { token } = user
    const order = await this.orderService.createOrder(token)

    res.redirect(`/order/${order.id}/summary`)
  }

  summary: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    const order = await this.orderService.getOrder(id)

    res.render('pages/order/summary', {
      order,
    })
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    const order = await this.orderService.getOrder(id)

    if (order.status === 'SUBMITTED') {
      res.redirect('/order/delete/failed')
    } else {
      res.render('pages/order/delete-confirm', {
        order,
      })
    }
  }

  delete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    const order = await this.orderService.getOrder(id)

    if (order.status === 'SUBMITTED') {
      res.redirect('/order/delete/failed')
    } else {
      await this.orderService.deleteOrder(id)
      res.redirect('/order/delete/success')
    }
  }

  deleteFailed: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-failed')
  }

  deleteSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-success')
  }
}
