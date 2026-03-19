import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType } from '../../../models/Address'

export default class AddressResultController {
  constructor(private readonly service: PostcodeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { postcode } = req.query
    const addresses = await this.service.lookupPostcode(postcode as string, addressType as AddressType)

    res.render('pages/order/postcode-lookup/address-result', Model.construct(addresses))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
