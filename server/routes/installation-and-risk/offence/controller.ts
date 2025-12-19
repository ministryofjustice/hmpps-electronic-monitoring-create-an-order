import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class OffenceController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Offence',
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const courts: (string | null | undefined)[] = [
      'CIVIL_COUNTY_COURT',
      'CROWN_COURT',
      'MAGISTRATES_COURT',
      'MILITARY_COURT',
      'SCOTTISH_COURT',
    ]
    if (courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1) {
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
    } else {
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
    }
  }
}
