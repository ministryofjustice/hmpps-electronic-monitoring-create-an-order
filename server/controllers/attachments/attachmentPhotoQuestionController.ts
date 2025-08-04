import { Request, RequestHandler, Response } from 'express'

export default class AttachmentPhotoQuestionController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/attachments/photo-question')
  }
}
