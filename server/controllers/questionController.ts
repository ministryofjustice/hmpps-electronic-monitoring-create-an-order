import { Request, RequestHandler, Response } from 'express'

export default class QuestionController {
  getSection: RequestHandler = (req: Request, res: Response) => {
    res.render(`pages/sections/${req.params.sectionName}/${req.params.questionName}`, {})
  }
}
