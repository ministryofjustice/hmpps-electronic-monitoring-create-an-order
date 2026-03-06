import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel, { AddressType } from './viewModel'
import FindAddressFormData from './formModel'
import PostcodeService from '../postcodeService'
import { isValidationResult, ValidationResult } from '../../../models/Validation'

export default class FindAddressController {
  constructor(private readonly service: PostcodeService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    // const formData = req.flash('formData') as unknown as FindAddressData[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render(
      'pages/order/postcode-lookup/find-address',
      ViewModel.construct(order, res.locals.content!, errors, addressType as AddressType),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { addressType } = req.params

    const formData = FindAddressFormData.parse(req.body)

    const result = this.service.validateFindAddressData(formData)

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
      )
      return
    }

    res.redirect(
      paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', order.id).replace(':addressType', addressType),
    )
  }
}
