import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
  ) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    const order = await this.orderService.createOrder({ accessToken: res.locals.user.token })

    res.redirect(`/order/${order.id}/summary`)
  }

  summary: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    try {
      const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId: id })

      res.render('pages/order/summary', {
        order,
      })
    } catch (e) {
      res.render('pages/error', { message: `Could not find an order with id: ${id}` })
    }
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.orderId
    const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId: id })

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
    const order = await this.orderService.getOrder({ accessToken: res.locals.user.token, orderId: id })

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
