import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'

export default class SpecialOrderController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const section = req.flash('SpecialOrderSection') as unknown as string
    res.render('pages/order/special-order', {
      section,
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
