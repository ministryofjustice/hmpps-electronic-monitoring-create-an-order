import { Request, RequestHandler, Response } from 'express'
import { AuditService, OrderService } from '../services'
import TaskListService from '../services/taskListService'
import paths from '../constants/paths'
import pdf from 'html-pdf'

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
    const orderId = req.order!.id

    res.render('pages/order/submit-success', {
      orderId,
    })
  }

  getReceipt: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    console.log('rendering the receipt page')
    res.render(`pages/order/receipt`, order)
  }

  downloadReciept: RequestHandler = async (req: Request, res: Response) => {
    const html = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Order Details</h1>
        <table>
            <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Total</th>
            </tr>
            <tr>
            </tr>
        </table>
    </body>
    </html>
`

    // Create PDF from HTML
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        res.status(500).send('Error generating PDF')
        return
      }

      // Set the response headers
      res.setHeader('Content-Disposition', `attachment; filename="order.pdf"`)
      res.setHeader('Content-Type', 'application/pdf')
      res.end(buffer)
    })

    // const orderId = req.order!.id
    // const downloadDate = new Date().toISOString()
    // console.log('downloading receipt')

    // const receipt = await this.orderService.downloadReceipt({
    //   accessToken: res.locals.user.token,
    //   orderId,
    // })

    // res.setHeader('Content-Type', 'application/pdf')
    // res.setHeader('Content-Disposition', `attachment; filename="${downloadDate}-receipt-order-${orderId}.pdf"`)
    // res.send(receipt)
    // res.end()
    console.log('receipt download complete')
  }
}
