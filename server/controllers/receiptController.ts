import { RequestHandler } from 'express'
import config from '../config'
import createViewModel from '../models/view-models/receipt'

export default class ReceiptController {
  viewReceipt: RequestHandler = async (req, res) => {
    res.render('pages/order/receipt/view', createViewModel(req.order!, res.locals.content!))
  }

  downloadReceipt: RequestHandler = async (req, res) => {
    const order = req.order!

    if (order.status === 'IN_PROGRESS') {
      throw new Error('A PDF can only be generated for a completed order.')
    }

    const { pdfMargins } = config.apis.gotenberg
    const date = new Date().toISOString().slice(0, 10)
    const filename = `${order.deviceWearer.firstName}-${order.deviceWearer.lastName}-${date}`

    res.renderPdf('pages/order/receipt/pdf', createViewModel(order, res.locals.content!), {
      filename,
      pdfMargins,
    })
  }
}
