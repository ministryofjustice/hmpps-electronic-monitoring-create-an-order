import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import constructModel from './viewModel'

export default class OffenceListController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    res.render('pages/order/installation-and-risk/offence/offence-list', constructModel(order, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.body
    if (formData.branch === 'Add') {
      if (order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT') {
        res.redirect(paths.INSTALLATION_AND_RISK.DAPO.replace(':orderId', order.id))
      } else {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM.replace(':orderId', order.id))
      }
    } else if (formData.branch === 'Next') {
      if (order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT') {
        res.redirect(paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION.replace(':orderId', order.id))
      } else {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
      }
    } else if (formData.branch === 'Delete') {
      res.redirect(paths.INSTALLATION_AND_RISK.DELETE.replace(':orderId', order.id))
    }
  }
}
