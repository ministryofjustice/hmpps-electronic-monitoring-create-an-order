import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class OffenceListDeleteController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/installation-and-risk/offence/delete', {
      question: 'Are you sure you want to delete this offence?',
      offenceTypeReadable: '12345 on 01/01/2025',
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
  }
}
