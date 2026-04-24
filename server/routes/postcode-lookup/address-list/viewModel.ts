import paths from '../../../constants/paths'
import { Address } from '../../../models/Address'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { createAddressAnswer } from '../../../utils/checkYourAnswers'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'

const CURFEW_ADDRESS_TYPES = ['PRIMARY', 'SECONDARY', 'TERTIARY'] as const
type CurfewAddressTypes = (typeof CURFEW_ADDRESS_TYPES)[number]
type CurfewAddress = Address & { addressType: CurfewAddressTypes }

const ADDRESS_KEY_MAP: Record<CurfewAddressTypes, string> = {
  PRIMARY: 'Main address',
  SECONDARY: 'Second curfew address',
  TERTIARY: 'Third curfew address',
}

const construct = (order: Order, errors: ValidationResult) => {
  const items = order.addresses.filter(isCurfewAddress).map(address => createAnswer(address, order.id))

  return {
    items,
    addAnother: {
      value: '',
      error: getError(errors, 'addAnother'),
    },
    showAddAnother: order.addresses.length < 3,
    errorSummary: createGovukErrorSummary(errors),
  }
}

const isCurfewAddress = (address: Address): address is CurfewAddress => {
  return (CURFEW_ADDRESS_TYPES as readonly string[]).includes(address.addressType)
}

const createAnswer = (address: CurfewAddress, orderId: string) => {
  const href = paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', orderId).replace(
    ':addressType',
    address.addressType,
  )

  return createAddressAnswer(ADDRESS_KEY_MAP[address.addressType], address, href, {})
}

export default { construct }
