import { Request, Response } from 'express'
import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import InterestedPartiesStoreService from '../interestedPartiesStoreService'
import UpdateInterestedPartiesService from '../interestedPartiesService'

export default abstract class InterestedPartiesBaseController {
  constructor(
    protected readonly store: InterestedPartiesStoreService,
    protected readonly service: UpdateInterestedPartiesService,
  ) {}

  async SubmitInterestedPartiesAndNext(order: Order, req: Request, res: Response) {
    const data = await this.store.getInterestedParties(order)
    await this.service.update({
      data,
      accessToken: res.locals.user.token,
      orderId: order.id,
    })

    if (data.responsibleOrganisation === 'PROBATION') {
      res.redirect(paths.INTEREST_PARTIES.PDU.replace(':orderId', order.id))
    } else {
      res.redirect(paths.INTEREST_PARTIES.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    }
  }
}
