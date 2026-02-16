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

    res.redirect(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
  }
}
