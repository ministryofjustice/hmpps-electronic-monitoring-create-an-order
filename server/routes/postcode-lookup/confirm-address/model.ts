import paths from '../../../constants/paths'
import { AddressType, AddressWithoutType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import { ConfirmAddressPageContent } from '../../../types/i18n/pages/postcodeLookup'

type ConfirmationAddressType = AddressType | 'APPOINTMENT'

type ConfirmAddressModel = {
  content: ConfirmAddressPageContent
  postcode: string
  addressCount: number
  buildingId?: string
  address: AddressWithoutType
  searchAgainLink: string
  manualAddressLink: string
  useDifferentAddressLink: string
}

const construct = (
  address: AddressWithoutType,
  content: I18n,
  opts: {
    orderId: string
    addressType: ConfirmationAddressType
    postcode?: string
    buildingId?: string
    addressCount: number
    useDifferentAddressLink: string
  },
): ConfirmAddressModel => {
  const addressType = opts.addressType.toUpperCase() as ConfirmationAddressType
  const searchAgainLink = paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', opts.orderId).replace(
    ':addressType',
    addressType,
  )
  const manualAddressLink = paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', opts.orderId).replace(
    ':addressType',
    addressType,
  )

  return {
    content: getContent(content, addressType),
    postcode: opts.postcode || '',
    addressCount: opts.addressCount,
    buildingId: opts.buildingId,
    address: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      addressLine3: address.addressLine3,
      addressLine4: address.addressLine4,
      postcode: address.postcode,
    },
    searchAgainLink,
    manualAddressLink,
    useDifferentAddressLink: opts.useDifferentAddressLink,
  }
}

function getContent(content: I18n, addressType: ConfirmationAddressType): ConfirmAddressPageContent {
  const mapping: Record<ConfirmationAddressType, ConfirmAddressPageContent> = {
    PRIMARY: content.pages.deviceWearerAddressConfirm,
    INSTALLATION: content.pages.tagAtSourceAddressConfirm,
    TERTIARY: content.pages.curfewAddressConfirm,
    SECONDARY: content.pages.curfewAddressConfirm,

    // These are also not used currently, can potentially be removed
    RESPONSIBLE_ADULT: content.pages.deviceWearerAddressConfirm,
    RESPONSIBLE_ORGANISATION: content.pages.deviceWearerAddressConfirm,
    // Currently, mandatory attendence monitoring address is not stored as a separate address
    APPOINTMENT: content.pages.appointmentAddressConfirm,
  }

  return mapping[addressType]
}

export default { construct }

export type { ConfirmAddressModel, ConfirmationAddressType }
