import { Request, RequestHandler, Response } from 'express'

export default class SectionController {
  getSection: RequestHandler = (req: Request, res: Response) => {
    let section = {}
    if (req.params.sectionName === 'identifyNumbers') {
      section = {
        id: '1',
        title: 'Identify numbers questions',
        questions: [
          { ref: '/section/identifyNumbers/question/nomisId', description: 'NOMIS ID' },
          { ref: 'x', description: 'PNC ID', value: 'mock ID' },
        ],
      }
      res.render('pages/sectionDetails', { section })
    } else res.render('pages/WIP', {})
  }
}
