import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import viewModel from './viewModel'

export default class OffenceController {
  constructor() {}

  courts: (string | null | undefined)[] = [
    'CIVIL_COUNTY_COURT',
    'CROWN_COURT',
    'MAGISTRATES_COURT',
    'MILITARY_COURT',
    'SCOTTISH_COURT',
  ]

  view: RequestHandler = async (req: Request, res: Response) => {
    const { offenceId } = req.params
    const order = req.order!
    const currentOffence = req.order!.offences!.find(offence => offence.id === offenceId)
    if (!currentOffence) {
      res.send(404)
      return
    }
    const showDate = this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1
    res.render('pages/order/installation-and-risk/offence/offence', viewModel.contruct(order, currentOffence, showDate))
  }

  new: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const showDate = this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1
    res.render('pages/order/installation-and-risk/offence/offence', viewModel.contruct(order, undefined, showDate))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    if (this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1) {
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
    } else {
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
    }
  }
}
