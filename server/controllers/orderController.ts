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
    res.render('pages/order/summary', {
      order: req.order,
    })
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect('/order/delete/failed')
    } else {
      res.render('pages/order/delete-confirm', {
        order,
      })
    }
  }

  delete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect('/order/delete/failed')
    } else {
      await this.orderService.deleteOrder(order.id)
      res.redirect('/order/delete/success')
    }
  }

  deleteFailed: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-failed')
  }

  deleteSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-success')
  }

  submit: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect('/order/submit/failed')
    } else {
      await this.orderService.submitOrder(order.id)
      res.redirect('/order/submit/success')
    }
  }

  submitFailed: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/submit-failed')
  }

  submitSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/submit-success')
  }
}
