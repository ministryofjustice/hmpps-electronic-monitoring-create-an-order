import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class OffenceController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Offence',
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.INSTALLATION_AND_RISK.BASE_URL.replace(':orderId', order.id))
  }
}
