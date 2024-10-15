import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import DeviceWearerAddressService from '../../services/deviceWearerAddressService'
import { DeviceWearerAddress, DeviceWearerAddressTypeEnum } from '../../models/DeviceWearerAddress'
import { getErrorsViewModel } from '../../utils/utils'

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
            paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType?', 'primary'),
          )
        } else {
          res.redirect(
            paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType?', 'installation'),
          )
        }
      } else {
        res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
      }
    }
  }
}
