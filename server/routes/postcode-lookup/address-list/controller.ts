import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class AddressListController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Address List',

      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
  }
}
