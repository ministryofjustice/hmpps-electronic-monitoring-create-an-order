import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'
import TaskListService from '../services/taskListService'
import paths from '../constants/paths'
import { CreateOrderFormDataParser } from '../models/form-data/order'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly taskListService: TaskListService,
  ) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    const formData = CreateOrderFormDataParser.parse(req.body)
    const order = await this.orderService.createOrder({ accessToken: res.locals.user.token, data: formData })

    res.redirect(`/order/${order.id}/summary`)
  }

  summary: RequestHandler = async (req: Request, res: Response) => {
    const sections = this.taskListService.getTasksBySection(req.order!)
    const error = req.flash('submissionError')

    res.render('pages/order/summary', {
      order: req.order,
      sections,
      error: error && error.length > 0 ? error[0] : undefined,
    })
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render('pages/order/delete-confirm', {
      order,
    })
  }

  delete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action } = req.body

    if (action === 'continue') {
      const result = await this.orderService.deleteOrder({
        orderId: order.id,
        accessToken: res.locals.user.token,
      })

      if (result.ok) {
        res.redirect(paths.ORDER.DELETE_SUCCESS)
      } else {
        req.flash('deletionErrors', result.error)
        res.redirect(paths.ORDER.DELETE_FAILED)
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }

  deleteFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('deletionErrors')

    res.render('pages/order/delete-failed', { errors })
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
    } else {
      req.flash('submissionError', 'Something unexpected happened. Please try again in a few minutes.')
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }

  submitFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')

    res.render('pages/order/submit-failed', { errors })
  }

  submitSuccess: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params

    res.render('pages/order/submit-success', {
      orderId,
    })
  }

  getReceipt: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render(`pages/order/receipt`, { order })
  }
}
