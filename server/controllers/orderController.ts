import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'
import TaskListService from '../services/taskListService'
import paths from '../constants/paths'

export default class OrderController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderService: OrderService,
    private readonly taskListService: TaskListService,
  ) {}

  create: RequestHandler = async (req: Request, res: Response) => {
    const order = await this.orderService.createOrder({ accessToken: res.locals.user.token })

    res.redirect(`/order/${order.id}/summary`)
  }

  summary: RequestHandler = async (req: Request, res: Response) => {
    const sections = this.taskListService.getTasksBySection(req.order!)
    res.render('pages/order/summary', {
      order: req.order,
      sections,
    })
  }

  confirmDelete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect(paths.ORDER.DELETE_FAILED)
    } else {
      res.render('pages/order/delete-confirm', {
        order,
      })
    }
  }

  delete: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect(paths.ORDER.DELETE_FAILED)
    } else {
      try {
        const { token } = res.locals.user
        await this.orderService.deleteOrder({ accessToken: token, orderId: order.id })

        res.redirect(paths.ORDER.DELETE_SUCCESS)
      } catch (error) {
        req.flash('validationErrors', error)

        res.redirect(paths.ORDER.DELETE_FAILED)
      }
    }
  }

  deleteFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')

    res.render('pages/order/delete-failed', { errors })
  }

  deleteSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/delete-success')
  }

  submit: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (order.status === 'SUBMITTED') {
      res.redirect(paths.ORDER.SUBMIT_FAILED)
    } else {
      try {
        const { token } = res.locals.user
        await this.orderService.submitOrder({ accessToken: token, orderId: order.id })

        res.redirect(paths.ORDER.SUBMIT_SUCCESS)
      } catch (error) {
        req.flash('validationErrors', error)

        res.redirect(paths.ORDER.SUBMIT_FAILED)
      }
    }
  }

  submitFailed: RequestHandler = async (req: Request, res: Response) => {
    const errors = req.flash('validationErrors')

    res.render('pages/order/submit-failed', { errors })
  }

  submitSuccess: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/submit-success')
  }

  getReceipt: RequestHandler = async (req: Request, res: Response) => {
    console.log("in order controller getReceipt")
    const order = req.order!
    console.log("rendeding the receipt page")
    res.render(`pages/order/receipt`, order)
  }

  downloadReciept: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    console.log("in order controller download receipt")

    const receipt = await this.orderService.downloadReceipt({
      accessToken: res.locals.user.token,
      orderId: order.id,
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="user_answers.pdf"`)
    res.send(receipt)
  }
}
