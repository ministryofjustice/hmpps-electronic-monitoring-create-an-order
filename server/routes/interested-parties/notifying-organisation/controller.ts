import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import isVariationType from '../../../utils/isVariationType'
import { notifyingOrganisationCourts } from '../../../models/NotifyingOrganisation'
import InterestedPartiesStoreService from '../InterestedPartiesStoreService'
import NotifyingOrganisationBase from './formModel'
import ViewModel from './viewModel'

export default class NotifingOrganisationController {
  constructor(private readonly store: InterestedPartiesStoreService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const storedData = await this.store.getInterestedParties(order)

    res.render('pages/order/interested-parties/notifying-organisation', ViewModel.construct(storedData, []))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = NotifyingOrganisationBase.parse(req.body)

    await this.store.updateNotifyingOrganisation(order, formData)

    if (isVariationType(order.type)) {
      const startDate = order.monitoringConditions.startDate
        ? new Date(order.monitoringConditions.startDate)
        : new Date(1900, 0, 0)

      if (startDate < new Date()) {
        return res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
      }
    }

    // TODO: validate before this point
    if ((notifyingOrganisationCourts as readonly string[]).indexOf(formData.notifyingOrganisation!) > -1) {
      return res.redirect(paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION.replace(':orderId', order.id))
    }
    return res.redirect(paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER.replace(':orderId', order.id))
  }
}
