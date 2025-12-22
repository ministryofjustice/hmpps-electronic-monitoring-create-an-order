import { Request, RequestHandler, Response } from 'express'

export default class HaveCourtOrderController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const model = {
      title: res.locals.content?.pages.haveCourtOrder.title,
      question: {
        text: res.locals.content?.pages.haveCourtOrder.questions.haveCourtOrder.text,
      },
    }
    res.render('pages/order/attachments/file-required', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {}
}
