import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'

export default class AddressResultController {
  constructor(private readonly service: PostcodeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    // const addresses = await this.service.lookupPostcode('SA111AA')
    await this.service.lookupPostcode('SA111AA')
    res.render('pages/order/postcode-lookup/address-result', {})
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
