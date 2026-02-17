import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class ResponsibleOrganisationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Responsible Organisation',
      items: [
        {
          value: 'Court',
          text: 'Court',
        },
        {
          value: 'Prison',
          text: 'Prison',
        },
        {
          value: 'Home Office',
          text: 'Home Office',
        },
        {
          value: 'Probation',
          text: 'Probation',
        },
      ],
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
  }
}
