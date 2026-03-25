import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import AddressService from '../../../services/addressService'

export default class AddressResultController {
  constructor(
    private readonly postcodeService: PostcodeService,
    private readonly addressService: AddressService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.order!.id
    const addressType = req.params.addressType as AddressType
    const postcode = req.query.postcode as string
    const buildingId = req.query.buildingId as string | undefined

    const addresses = await this.postcodeService.lookupByPostcode(postcode, addressType, buildingId)

    res.render(
      'pages/order/postcode-lookup/address-result',
      Model.construct(addresses, res.locals.content as I18n, { orderId, addressType, postcode, buildingId }),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params
    const uprn = req.body.address as string

    // save to backend
    // next page can use the backend to show the selected address
    const address = await this.postcodeService.lookupByUPRN(uprn)

    await this.addressService.updateAddress({
      accessToken: '1',
      orderId: order.id,
      data: { ...address, addressType },
    })

    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
