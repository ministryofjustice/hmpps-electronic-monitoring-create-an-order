import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import AddressService from '../../services/addressService'
import { AddressType, AddressTypeEnum } from '../../models/Address'
import { getErrorsViewModel } from '../../utils/utils'
import { isValidationResult } from '../../models/Validation'
import { Order } from '../../models/Order'
import nextPage, { getSelectedMonitoringTypes } from '../monitoringConditions/nextPage'

const FormDataModel = z.object({
  action: z.string().default('continue'),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  addressLine4: z.string(),
  postcode: z.string(),
  hasAnotherAddress: z.string().default('false'),
})

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

  getCurrentPage(addressType: string) {
    if (addressType.toUpperCase() === 'INSTALLATION') {
      return paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', addressType)
    }

    return paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', addressType)
  }

  getNextPage(addressType: string, order: Order, hasAnotherAddress: string) {
    if (addressType.toUpperCase() === 'INSTALLATION') {
      return nextPage(getSelectedMonitoringTypes(order.monitoringConditions))
    }

    if (hasAnotherAddress === 'true') {
      if (addressType.toUpperCase() === 'PRIMARY') {
        return paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'secondary')
      }

      if (addressType.toUpperCase() === 'SECONDARY') {
        return paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'tertiary')
      }
    }

    return paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION
  }

  get: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { addresses } = req.order!
    const currentAddress = addresses.find(address => address.addressType === addressType.toUpperCase())
    const nextAddressType = getNextAddressType(AddressTypeEnum.parse(addressType.toUpperCase()))
    const hasAnotherAddress = addresses.some(address => address.addressType === nextAddressType)
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render('pages/order/contact-information/address', {
      addressType,
      ...currentAddress,
      hasAnotherAddress: addresses.length === 0 ? '' : String(hasAnotherAddress),
      ...(formData.length > 0 ? (formData[0] as never) : {}),
      errors: getErrorsViewModel(errors as never),
    })
  }

  post: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { orderId, addressType } = req.params
    const { action, hasAnotherAddress, ...formData } = FormDataModel.parse(req.body)

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

      res.redirect(this.getCurrentPage(addressType).replace(':orderId', orderId))
    } else if (action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    } else {
      res.redirect(this.getNextPage(addressType, order, hasAnotherAddress).replace(':orderId', orderId))
    }
  }
}
