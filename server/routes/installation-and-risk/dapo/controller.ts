import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'

export default class DapoController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    res.render('pages/order/installation-and-risk/offence/dapo', ViewModel.contructFromOrder(order, '123', []))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
  }
}
