import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class InterestedPartiesCheckYourAnswersController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Check Your Answers',
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
  }
}
