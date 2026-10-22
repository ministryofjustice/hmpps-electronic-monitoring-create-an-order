import { Address, AddressTypeEnum } from '../../models/Address'
import { lookup, createAddressPreview } from './displayHelpers'

describe('lookup', () => {
  it.each([
    ['empty map should return default value', {}, 'foo', '', ''],
    ['missing key should return default value', { foo: 'bar' }, 'baz', '', ''],
    ['existing key should return map value', { foo: 'bar' }, 'foo', '', 'bar'],
  ])(
    '%s - lookup(%s, "%s", "%s") === "%s"',
    (_: string, map: Record<string, string>, lookupValue: string, defaultValue: string, expectedValue: string) => {
      expect(lookup(map, lookupValue, defaultValue)).toBe(expectedValue)
    },
  )
})

describe('createAddressPreview', () => {
  it.each([
    ['undefined address', undefined, ''],
    ['null address', null, ''],
    [
      'Complete address',
      {
        addressType: AddressTypeEnum.enum.PRIMARY,
        addressLine1: 'Line 1',
        addressLine2: 'Line 2',
        addressLine3: 'Line 3',
        addressLine4: 'Line 4',
        postcode: 'Postcode',
      },
      'Line 1, Line 2, Line 3, Line 4, Postcode',
    ],
    [
      'Partial address',
      {
        addressType: AddressTypeEnum.enum.PRIMARY,
        addressLine1: 'Line 1',
        addressLine2: '',
        addressLine3: 'County',
        addressLine4: '',
        postcode: 'Postcode',
      },
      'Line 1, County, Postcode',
    ],
  ])(
    '%s - createAddressPreview(%s) === "%s"',
    (_: string, address: Address | null | undefined, expectedValue: string) => {
      expect(createAddressPreview(address)).toBe(expectedValue)
    },
  )
})
