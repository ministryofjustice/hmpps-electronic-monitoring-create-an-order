import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class ConfrimAddressController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Confirm Address',

      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    res.redirect(paths.POSTCODE_LOOKUP.ADDRESS_LIST.replace(':orderId', order.id).replace(':addressType', addressType))
  }
}
