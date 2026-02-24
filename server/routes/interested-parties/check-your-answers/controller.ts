import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'

export default class InterestedPartiesCheckYourAnswersController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render(
      'pages/order/interested-parties/check-your-answers',
      ViewModel.construct(req.order!, res.locals.content!),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
  }
}
