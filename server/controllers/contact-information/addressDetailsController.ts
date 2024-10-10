import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService, AddressService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import addressDetailsViewModel from '../../models/view-models/addressDetails'
import AddressDetailsFormDataModel from '../../models/form-data/addressDetails'
import { DeviceWearerAddressInformation, DeviceWearerAddressType, DeviceWearerAddressTypeEnum } from '../../models/DeviceWearerAddressInformation'
import { Address } from '../../models/Address'

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

  private getActiveAddress(addressInformation: DeviceWearerAddressInformation, addressType: DeviceWearerAddressType): Address {
    const placeholderAddress = {
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
  };

    if (addressType === DeviceWearerAddressTypeEnum.Enum.PRIMARY) {
      return addressInformation.primaryAddress || placeholderAddress
    }

    if (addressType === DeviceWearerAddressTypeEnum.Enum.SECONDARY) {
      return addressInformation.secondaryAddress || placeholderAddress
    }

    if (addressType === DeviceWearerAddressTypeEnum.Enum.TERTIARY) {
      return addressInformation.tertiaryAddress || placeholderAddress
    }

    return placeholderAddress
  }

  get: RequestHandler = async (req: Request, res: Response) => {
    console.log('hit here')
    const { addressType } = req.params
    const { deviceWearerAddressInformation: addressInformation } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    
    const activeAddress = this.getActiveAddress(addressInformation, DeviceWearerAddressTypeEnum.parse(addressType))
    const hasAnotherAddress = false

    const viewModel = addressDetailsViewModel.construct(
      activeAddress,
      formData[0] as never,
      errors as never,
      hasAnotherAddress,
    )

    res.render(`pages/order/contact-information/address`, viewModel)
  }

  post: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, hasAnotherAddress, ...formData } = AddressDetailsFormDataModel.parse(req.body)
    const submissionData = {
      [addressType === 'PRIMARY' ? 'primaryAddress' : addressType === 'SECONDARY' ? 'secondaryAddress' : 'tertiaryAddress']: formData
    }

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: submissionData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId).replace(':addressType', addressType),
      )
    } else if (action === 'continue') {
      res.redirect(this.getNextPage(orderId, DeviceWearerAddressTypeEnum.parse(addressType), hasAnotherAddress))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
