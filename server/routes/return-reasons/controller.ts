import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import ReturnReasonsFormModel from './formModel'
import returnReasonsViewModel from './viewModel'

export default class ReturnReasonsController {
  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const orderSummaryUri = res.locals.orderSummaryUri ?? paths.ORDER.SUMMARY.replace(':orderId', order.id)
    res.render('pages/order/return-reasons', returnReasonsViewModel.construct(order, orderSummaryUri))
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
