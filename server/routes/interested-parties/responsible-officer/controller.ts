import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class ResponsibleOfficerController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/interested-parties/responsible-officer')
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
  }
}
