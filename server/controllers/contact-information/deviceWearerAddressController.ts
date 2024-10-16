import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import DeviceWearerAddressService from '../../services/deviceWearerAddressService'
import {
  DeviceWearerAddress,
  DeviceWearerAddressType,
  DeviceWearerAddressTypeEnum,
} from '../../models/DeviceWearerAddress'
import { getErrorsViewModel } from '../../utils/utils'
import { isValidationResult } from '../../models/Validation'

const getNextAddressType = (addressType: DeviceWearerAddressType) => {
  if (addressType === 'PRIMARY') {
    return DeviceWearerAddressTypeEnum.Enum.SECONDARY
  }

  if (addressType === 'SECONDARY') {
    return DeviceWearerAddressTypeEnum.Enum.TERTIARY
  }

  return undefined
}

export default class DeviceWearerAddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerAddressService: DeviceWearerAddressService,
  ) {}

  private hasFixedAbode(addresses: Array<DeviceWearerAddress>) {
    if (addresses.length === 0) {
      // Unknown
      return null
    }

    return !addresses.some(address => address.addressType === DeviceWearerAddressTypeEnum.Enum.NO_FIXED_ABODE)
  }

  getFixedAbode: RequestHandler = async (req: Request, res: Response) => {
    const { deviceWearerAddresses: addresses } = req.order!
    const hasFixedAbode = this.hasFixedAbode(addresses)
    const errors = req.flash('validationErrors')

    res.render('pages/order/contact-information/fixed-abode', {
      fixedAbode: String(hasFixedAbode),
      errors: getErrorsViewModel(errors as never),
    })
  }

  postFixedAbode: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, fixedAbode } = req.body

    if (fixedAbode === undefined) {
      req.flash('validationErrors', [
        { field: 'fixedAbode', error: 'You must indicate whether the device wearer has a fixed abode' },
      ])
      res.redirect(paths.CONTACT_INFORMATION.ADDRESSES_NO_FIXED_ABODE.replace(':orderId', orderId))
    } else {
      if (fixedAbode === 'false') {
        await this.deviceWearerAddressService.updateAddress({
          accessToken: res.locals.user.token,
          orderId,
          data: {
            addressType: DeviceWearerAddressTypeEnum.Enum.NO_FIXED_ABODE,
          },
        })
      }

      if (action === 'continue') {
        if (fixedAbode === 'true') {
          res.redirect(
            paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'primary'),
          )
        } else {
          res.redirect(
            paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'installation'),
          )
        }
      } else {
        res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
      }
    }
  }

  getAddress: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { deviceWearerAddresses: addresses } = req.order!
    const currentAddress = addresses.find(address => address.addressType === addressType.toUpperCase())
    const nextAddressType = getNextAddressType(DeviceWearerAddressTypeEnum.parse(addressType.toUpperCase()))
    const hasAnotherAddress = addresses.some(address => address.addressType === nextAddressType)
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render('pages/order/contact-information/address', {
      addressType,
      ...currentAddress?.address,
      installationAddress: currentAddress?.installationAddress,
      hasAnotherAddress,
      ...(formData.length > 0 ? (formData[0] as never) : {}),
      errors: getErrorsViewModel(errors as never),
    })
  }

  postAddress: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, ...formData } = req.body
    const { deviceWearerAddresses: addresses } = req.order!

    const result = await this.deviceWearerAddressService.updateAddress({
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
    } else if (addressType.toUpperCase() === 'PRIMARY') {
      if (!result.installationAddress) {
        res.redirect(
          paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'installation'),
        )
      } else {
        res.redirect(paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION.replace(':orderId', orderId))
      }
    } else {
      const primaryAddress = addresses.find(address => address.addressType === 'PRIMARY')
      if (primaryAddress && primaryAddress.installationAddress) {
        res.redirect(paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION.replace(':orderId', orderId))
      } else {
        res.redirect(
          paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', 'installation'),
        )
      }
    }
  }
}
