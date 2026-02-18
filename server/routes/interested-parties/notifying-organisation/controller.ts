import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import isVariationType from '../../../utils/isVariationType'

export default class NotifingOrganisationController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/order/interested-parties/notifying-organisation', {
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

    if (isVariationType(order.type)) {
      const startDate = order.monitoringConditions.startDate
        ? new Date(order.monitoringConditions.startDate)
        : new Date(1900, 0, 0)

      if (startDate < new Date()) {
        return res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
      }
    }

    if (formData.branch === 'Court')
      return res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))

    return res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id))
  }
}
