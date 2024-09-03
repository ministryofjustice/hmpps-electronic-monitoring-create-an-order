import { Request, RequestHandler, Response } from 'express'
import ValidatorFactory from '../services/validatorFactory'

export default class QuestionController {
  getSection: RequestHandler = (req: Request, res: Response) => {
    req.session.returnTo = `pages/sections/${req.params.sectionName}/${req.params.questionName}`
    res.render(`pages/sections/${req.params.sectionName}/${req.params.questionName}`, {
      formData: req.session.formData,
    })
  }

  postNext: RequestHandler = (req: Request, res: Response) => {
    const currentPage = req.session.returnTo.split('/')
    const section = currentPage[2]
    const question = currentPage[3]
    if (req.session.formData === undefined) req.session.formData = {}

    const validator = ValidatorFactory.getValidator(section, question)
    const result = validator.validate(req)
    if (!result.success)
      res.render(`pages/sections/${section}/${question}`, { error: result.errors, formData: req.session.formData })
    else res.render(`pages/WIP`, {})
  }
}
