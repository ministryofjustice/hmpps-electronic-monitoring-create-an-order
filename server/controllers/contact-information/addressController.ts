import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import AddressService from '../../services/addressService'
import { AddressType, AddressTypeEnum } from '../../models/Address'
import { getErrorsViewModel } from '../../utils/utils'
import { isValidationResult } from '../../models/Validation'

const getNextAddressType = (addressType: AddressType) => {
  if (addressType === 'PRIMARY') {
    return AddressTypeEnum.Enum.SECONDARY
  }

  if (addressType === 'SECONDARY') {
    return AddressTypeEnum.Enum.TERTIARY
  }

  return undefined
}

export default class AddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly addressService: AddressService,
  ) {}

  get: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { addresses } = req.order!
    const currentAddress = addresses.find(address => address.addressType === addressType.toUpperCase())
    const nextAddressType = getNextAddressType(AddressTypeEnum.parse(addressType.toUpperCase()))
    const hasAnotherAddress = addresses.some(address => address.addressType === nextAddressType)
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render('pages/order/contact-information/address', {
      ...currentAddress,
      hasAnotherAddress,
      ...(formData.length > 0 ? (formData[0] as never) : {}),
      errors: getErrorsViewModel(errors as never),
    })
  }

  post: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, ...formData } = req.body

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: {
        addressType: addressType.toUpperCase(),
        ...formData,
      },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', addressType),
      )
    } else if (action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    } else if (formData.hasAnotherAddress === 'true') {
      if (addressType.toUpperCase() === 'PRIMARY') {
        res.redirect(
          paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'secondary'),
        )
      }

      if (addressType.toUpperCase() === 'SECONDARY') {
        res.redirect(
          paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'tertiary'),
        )
      }
    } else {
      res.redirect(paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION.replace(':orderId', orderId))
    }
  }
}
