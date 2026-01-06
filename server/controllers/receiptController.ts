import { RequestHandler } from 'express'
import config from '../config'
import createViewModel from '../models/view-models/receipt'
import { FmsRequestService } from '../services'

export default class ReceiptController {
  constructor(private readonly fmsRequestService: FmsRequestService) {}

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

  downloadFmsDeviceWearerRequest: RequestHandler = async (req, res) => {
    const order = req.order!

    if (order.status === 'IN_PROGRESS') {
      throw new Error('A FMS request can only be downloaded for a completed order.')
    }
    const payload = await this.fmsRequestService.getFmsDeviceWearerRequest({
      orderId: order.id,
      versionId: order.versionId,
      accessToken: res.locals.user.token,
    })
    res.header('Content-Type', 'application/json')
    res.header('Content-Transfer-Encoding', 'binary')
    res.header('Content-Disposition', `attachment; filename=${order.id}-fms-dw-request.json`)
    res.send(payload)
  }

  downloadFmsMonitoringOrderRequest: RequestHandler = async (req, res) => {
    const order = req.order!

    if (order.status === 'IN_PROGRESS') {
      throw new Error('A FMS request can only be downloaded for a completed order.')
    }
    const payload = await this.fmsRequestService.getFmsMonitoringRequest({
      orderId: order.id,
      versionId: order.versionId,
      accessToken: res.locals.user.token,
    })
    res.header('Content-Type', 'application/json')
    res.header('Content-Transfer-Encoding', 'binary')
    res.header('Content-Disposition', `attachment; filename=${order.id}-fms-mo-request.json`)
    res.send(payload)
  }
}
