import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import { AddressType } from '../../../models/Address'
import { isValidationResult } from '../../../models/Validation'
import { AddressFormDataModel } from '../../../models/form-data/address'
import { AuditService } from '../../../services'
import AddressService from '../../../services/addressService'
import PostcodeService from '../postcodeService'

export default class EnterAddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly addressService: AddressService,
    private readonly postcodeService: PostcodeService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const { addresses } = req.order!
    const viewModel = ViewModel.construct(
      addressType as AddressType,
      addresses,
      formData[0] as never,
      res.locals.content!,
      errors as never,
    )

    res.render('pages/order/postcode-lookup/enter-address', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, ...formData } = AddressFormDataModel.parse(req.body)

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: {
        ...formData,
        addressType,
      },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType),
      )
    } else if (action === 'continue') {
      res.redirect(
        this.postcodeService.buildUrl(
          paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS,
          orderId,
          addressType,
          formData.postcode,
          '',
        ),
      )
    } else {
      res.redirect(paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType))
    }
  }
}
