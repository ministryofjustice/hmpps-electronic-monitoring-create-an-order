import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class NotifingOrganisationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Notifying Organisation',
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
    const formData = req.body

    if (formData.branch === 'Court')
      res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
    else {
      res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id))
    }
  }
}
