import { Request, RequestHandler, Response } from 'express'

export default class SectionController {
  getSection: RequestHandler = (req: Request, res: Response) => {
    if (req.session.formData === undefined) req.session.formData = { id: '1' }
    let section = {}
    if (req.params.sectionName === 'identifyNumbers') {
      section = {
        id: '1',
        title: 'Identify numbers questions',
        questions: [
          {
            ref: '/section/identifynumbers/question/nomisId',
            description: 'Nomis ID',
            value: req.session.formData.nomisId,
          },
          { ref: '/section/identifynumbers/question/pndId', description: 'PND ID', value: req.session.formData.pndId },
        ],
      }
      res.render('pages/sectionDetails', { section, formData: req.session.formData })
    } else res.render('pages/WIP', {})
  }
}
