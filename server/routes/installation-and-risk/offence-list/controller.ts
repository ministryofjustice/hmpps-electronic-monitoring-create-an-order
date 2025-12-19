import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class OffenceListController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Offence List',
      items: [
        {
          value: 'Add',
          text: 'Add',
        },
        {
          value: 'Next',
          text: 'Next',
        },
        {
          value: 'Delete',
          text: 'Delete',
        },
      ],
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.body
    if (formData.branch === 'Add') {
      if (order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT') {
        res.redirect(paths.INSTALLATION_AND_RISK.DAPO.replace(':orderId', order.id))
      } else {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE.replace(':orderId', order.id))
      }
    } else if (formData.branch === 'Next')
      if (order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT') {
        res.redirect(paths.INSTALLATION_AND_RISK.BASE_URL.replace(':orderId', order.id))
      } else {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
      }
  }
}
