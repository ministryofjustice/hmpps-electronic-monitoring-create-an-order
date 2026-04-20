import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import { AddressType } from '../../../models/Address'
import { isValidationResult } from '../../../models/Validation'
import { AddressFormDataModel } from '../../../models/form-data/address'
import { AuditService } from '../../../services'
import AddressService from '../../../services/addressService'

export default class EnterAddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly addressService: AddressService,
  ) {}

  getCurrentPageUrl(addressType: string, orderId: string) {
    return paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const { addresses } = req.order!
    const viewModel = ViewModel.construct(addressType as AddressType, addresses, formData[0] as never, errors as never)

    res.render('pages/order/postcode-lookup/enter-address', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, ...formData } = AddressFormDataModel.parse(req.body)
    const order = req.order!

    if (action === 'back') {
      res.redirect(paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', orderId).replace(':addressType', addressType))
      return
    }

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

      res.redirect(this.getCurrentPageUrl(addressType, orderId))
      return
    }

    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
