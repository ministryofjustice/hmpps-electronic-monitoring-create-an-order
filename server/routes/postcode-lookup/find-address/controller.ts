import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'

export default class FindAddressController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/postcode-lookup/find-address', ViewModel.construct(req.order!, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const { addressType } = req.params

    res.redirect(
      paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
