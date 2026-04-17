import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import PostcodeService from '../postcodeService'
import { AddressType } from '../../../models/Address'
import { ValidationResult } from '../../../models/Validation'

export default class EnterAddressController {
  constructor(private readonly service: PostcodeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const formData = req.flash('formData')[0]
    const { addresses } = req.order!
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const { addressType } = req.body
    const viewModel = ViewModel.construct(addressType as AddressType, addresses, formData[0] as never, errors as never)

    res.render('pages/order/postcode-lookup/enter-address', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params
    res.redirect(
      paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
