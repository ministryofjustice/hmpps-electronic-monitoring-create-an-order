import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService, AddressService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import addressDetailsViewModel from '../../models/view-models/addressDetails'
import AddressDetailsFormDataModel from '../../models/form-data/addressDetails'
import { DeviceWearerAddress, DeviceWearerAddressType, DeviceWearerAddressTypeEnum } from '../../models/DeviceWearerAddress'

const nextAddressMap = {
  [DeviceWearerAddressTypeEnum.Enum.PRIMARY]: DeviceWearerAddressTypeEnum.enum.SECONDARY,
  [DeviceWearerAddressTypeEnum.Enum.SECONDARY]: DeviceWearerAddressTypeEnum.enum.TERTIARY,
  [DeviceWearerAddressTypeEnum.enum.TERTIARY]: 'blackhole'
}

export default class AddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly addressService: AddressService,
  ) {}

  private getNextPage(orderId: string, currentAddressType: DeviceWearerAddressType, hasAnotherAddress: boolean) {
    if (
      (currentAddressType === DeviceWearerAddressTypeEnum.Enum.PRIMARY || currentAddressType === DeviceWearerAddressTypeEnum.Enum.SECONDARY) &&
      hasAnotherAddress
    ) {
      return paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(
        ':addressType',
        nextAddressMap[currentAddressType],
      )
    }
    return paths.CONTACT_INFORMATION.RESPONSIBLE_OFFICER.replace(':orderId', orderId)
  }

  private getActiveAddress(addresses: Array<DeviceWearerAddress>, addressType: DeviceWearerAddressType): DeviceWearerAddress {
    const matchedAddress = addresses.find(address => address.addressType.toLowerCase() === addressType.toLowerCase())

    if(matchedAddress) {
      return matchedAddress
    }

    return {
      addressType: 'PRIMARY',
      address: {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
      }
    }
  }

  get: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { deviceWearerAddresses: addresses } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    
    const activeAddress = this.getActiveAddress(addresses, DeviceWearerAddressTypeEnum.parse(addressType))
    const hasAnotherAddress = addresses.some(address => address.addressType === nextAddressMap[activeAddress.addressType])

    const viewModel = addressDetailsViewModel.construct(
      activeAddress,
      formData[0] as never,
      errors as never,
      hasAnotherAddress,
    )

    res.render(`pages/order/contact-information/address`, viewModel)
  }

  post: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, hasAnotherAddress, ...formData } = AddressDetailsFormDataModel.parse(req.body)

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', formData.addressType),
      )
    } else if (action === 'continue') {
      res.redirect(this.getNextPage(orderId, result.addressType, hasAnotherAddress))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
