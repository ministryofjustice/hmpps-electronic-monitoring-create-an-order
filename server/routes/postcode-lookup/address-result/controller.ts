import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import AddressService from '../../../services/addressService'
import { ValidationResult } from '../../../models/Validation'

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
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    const addresses = await this.postcodeService.lookupByPostcode(postcode, addressType, buildingId)

    const model = Model.construct(addresses, res.locals.content as I18n, errors, {
      orderId,
      addressType,
      postcode,
      buildingId,
    })

    if (addresses.length === 0) {
      res.render('pages/order/postcode-lookup/no-results', model)
      return
    }

    res.render('pages/order/postcode-lookup/address-result', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params
    const uprn = req.body.address as string
    const { postcode, buildingId } = req.body

    if (uprn === undefined) {
      req.flash('validationErrors', [
        {
          error: 'Select the address',
          field: 'address',
        },
      ])

      const path = paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', order.id).replace(
        ':addressType',
        addressType,
      )

      const query = new URLSearchParams({
        postcode,
        buildingId,
      }).toString()

      const url = `${path}?${query}`

      res.redirect(url)

      return
    }

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
