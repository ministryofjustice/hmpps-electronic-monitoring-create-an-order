import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'

export default class OffenceListDeleteController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const id = req.params.offenceId

    res.render('pages/order/installation-and-risk/offence/delete', ViewModel.construct(order, id))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
  }
}
