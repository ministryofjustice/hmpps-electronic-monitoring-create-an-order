import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'
import paths from '../constants/paths'

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
    const error = req.flash('submissionError')
    res.render('pages/order/summary', {
      order: req.order,
      error: error && error.length > 0 ? error[0] : undefined,
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

    const result = await this.orderService.submitOrder({
      orderId: order.id,
      accessToken: res.locals.user.token,
    })

    if (result.submitted) {
      res.redirect(paths.ORDER.SUBMIT_SUCCESS.replace(':orderId', order.id))
    } else if (result.type === 'alreadySubmitted' || result.type === 'incomplete') {
      req.flash('submissionError', result.error)
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    } else if (result.type === 'errorStatus') {
      res.redirect(paths.ORDER.SUBMIT_FAILED.replace(':orderId', order.id))
    }
  }

  submitFailed: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/submit-failed')
  }

  submitSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/submit-success')
  }
}
