import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import { AddressType } from '../../../models/Address'
import { isValidationResult } from '../../../models/Validation'
import { AddressFormDataModel } from '../../../models/form-data/address'
import AddressService from '../../../services/addressService'
import PostcodeService from '../postcodeService'

export default class EnterAddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly postcodeService: PostcodeService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const addressType = req.params.addressType as string
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const isFailObtainAddress = req.flash('isFailObtainAddress')
    const { addresses } = req.order!
    const viewModel = ViewModel.construct(
      addressType as AddressType,
      addresses,
      formData[0] as never,
      res.locals.content!,
      errors as never,
      isFailObtainAddress.length > 0 && isFailObtainAddress[0] === 'true',
    )

    res.render('pages/order/postcode-lookup/enter-address', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const addressType = req.params.addressType as string
    const orderId = req.params.orderId as string
    const { action, ...formData } = AddressFormDataModel.parse(req.body)

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: {
        ...formData,
        addressType,
        hasAnotherAddress: (
          addressType.toLowerCase() === 'primary' || addressType.toLowerCase() === 'secondary'
        ).toString(), // default hasAnotherAddress to true to avoid remove of other address, need to remove after clear old address update
      },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType),
      )
    } else {
      res.redirect(
        paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType),
      )
    }
  }
}
