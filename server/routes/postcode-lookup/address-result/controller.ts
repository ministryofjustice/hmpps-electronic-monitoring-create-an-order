import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType } from '../../../models/Address'

export default class AddressResultController {
  constructor(private readonly service: PostcodeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const addressType = req.params.addressType as AddressType
    const postcode = req.query.postcode as string
    const buildingId = req.query.buildingId as string | undefined

    const addresses = await this.service.lookupPostcode(postcode, addressType, buildingId)

    res.render(
      'pages/order/postcode-lookup/address-result',
      Model.construct(addresses, { orderId, addressType, postcode, buildingId }),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
