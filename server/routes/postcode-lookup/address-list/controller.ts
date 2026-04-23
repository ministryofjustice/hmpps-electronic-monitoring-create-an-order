import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'

export default class AddressListController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render('pages/order/postcode-lookup/address-list', ViewModel.construct(order))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
  }
}
