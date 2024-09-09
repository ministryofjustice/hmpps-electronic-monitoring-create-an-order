import { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService } from '../services'

export default class FormController {
  constructor(private readonly auditService: AuditService) {}

  getForms: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    await this.auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const orderList = [
      { title: 'Test Form 1', status: 'Draft' },
      { title: 'Test Form 2', status: 'Draft' },
      { title: 'Test Form 3', status: 'Draft' },
      { title: 'Test Form 4', status: 'Submitted' },
      { title: 'Test Form 5', status: 'Submitted' },
    ]
    res.render('pages/index', { orderList })
  }

  getNewFormPage: RequestHandler = (req: Request, res: Response) => {
    res.render('pages/newForm')
  }

  postNewForm: RequestHandler = (req: Request, res: Response) => {
    if (req.body.formType === 'HDC') res.render('pages/hdc')
    else res.render('pages/WIP')
  }

  createForm: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    await this.auditService.logAuditEvent({
      who: res.locals.user.username,
      correlationId: req.id,
      what: 'Create new electronic monitoring form',
    })
    let form = {}

    req.session.formData = { id: '1' }
    if (req.body.formType === 'HDC') {
      form = {
        id: '1',
        title: 'Home Detention Curfew (HDC) form',
        sections: [
          { ref: '/section/abc/identityNumbers', description: 'Identity numbers', isComplete: true },
          { ref: 'x', description: 'About the device wearer', isComplete: false },
          { ref: 'x', description: 'About the HDC', isComplete: false },
          { ref: 'x', description: 'Other monitoring conditions', isComplete: false },
          { ref: 'x', description: 'Installations and risk information', isComplete: false },
          { ref: 'x', description: 'About organisations', isComplete: false },
        ],
      }

      res.render('pages/details', { form })
    } else res.render('pages/WIP')
  }
}
