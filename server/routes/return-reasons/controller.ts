import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import StatusUpdateService from '../status-updates/service'
import ReturnReasonsFormModel from './formModel'
import returnReasonsViewModel from './viewModel'

export default class ReturnReasonsController {
  constructor(private readonly statusUpdateService: StatusUpdateService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const orderSummaryUri = res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', order.id)
    const statusUpdates = await this.statusUpdateService.getStatusUpdates({
      orderId: order.id,
      accessToken: res.locals.user.token,
    })
    res.render(
      'pages/order/return-reasons',
      returnReasonsViewModel.construct(
        statusUpdates.filter(statusUpdate => statusUpdate.orderVersionId === order.versionId),
        orderSummaryUri,
      ),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const formData = ReturnReasonsFormModel.parse(req.body)
    const orderId = req.order!.id

    if (formData.action === 'returnToSummary') {
      res.redirect(res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', orderId))
      return
    }

    res.redirect(paths.ORDER.RETURN_REASONS.replace(':orderId', orderId))
  }
}
