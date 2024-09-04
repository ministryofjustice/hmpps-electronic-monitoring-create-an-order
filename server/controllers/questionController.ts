import { Request, RequestHandler, Response } from 'express'
import InputValidator from '../services/inputValidator'

export default class QuestionController {
  getSection: RequestHandler = (req: Request, res: Response) => {
    req.session.returnTo = `pages/sections/${req.params.sectionName}/${req.params.questionName}`
    res.render(`pages/sections/${req.params.sectionName}/${req.params.questionName}`, {
      formData: req.session.formData,
    })
  }

  postNext: RequestHandler = (req: Request, res: Response) => {
    if (req.session.formData === undefined) req.session.formData = { id: '1' }

    const result = InputValidator.validateInput(req)
    if (!result.success) res.render(req.session.returnTo, { error: result.errors, formData: req.session.formData })
    else {
      res.redirect(result.nextPath)
    }
  }
}
