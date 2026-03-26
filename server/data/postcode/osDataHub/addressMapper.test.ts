import { AddressWithoutTypeUPRN } from '../../../models/Address'
import AddressMapper from './addressMapper'
import { OSDataHubAddress, OSDataHubPostcodeResponse } from './osDataHubPostcodeResponse'

const createData = (address: OSDataHubAddress['DPA']): OSDataHubPostcodeResponse => {
  return { results: [{ DPA: address }] }
}

describe('address mapper', () => {
  const addressMapper = new AddressMapper()
  it('can map address with building number', () => {
    const data: OSDataHubPostcodeResponse = createData({
      BUILDING_NUMBER: 10,
      THOROUGHFARE_NAME: 'DOWNING STREET',
      POST_TOWN: 'LONDON',
      POSTCODE: 'SW1A 2AA',
      UPRN: 101,
    })

    const expected: AddressWithoutTypeUPRN[] = [
      {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
        uprn: 101,
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })

  it('can map address with building name', () => {
    const data: OSDataHubPostcodeResponse = createData({
      BUILDING_NAME: 'PM HOUSE',
      THOROUGHFARE_NAME: 'DOWNING STREET',
      POST_TOWN: 'LONDON',
      POSTCODE: 'SW1A 2AA',
      UPRN: 102,
    })

    const expected: AddressWithoutTypeUPRN[] = [
      {
        addressLine1: 'PM HOUSE Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
        uprn: 102,
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })

  it('can map address with org name', () => {
    const data: OSDataHubPostcodeResponse = createData({
      ORGANISATION_NAME: 'PM ORG',
      THOROUGHFARE_NAME: 'DOWNING STREET',
      POST_TOWN: 'LONDON',
      POSTCODE: 'SW1A 2AA',
      UPRN: 103,
    })

    const expected: AddressWithoutTypeUPRN[] = [
      {
        addressLine1: 'PM ORG Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
        uprn: 103,
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })

  it('can map address lines two and four', () => {
    const data: OSDataHubPostcodeResponse = createData({
      ORGANISATION_NAME: 'PM ORG',
      SUB_BUILDING_NAME: 'SUB BUILDING NAME',
      THOROUGHFARE_NAME: 'DOWNING STREET',
      POST_TOWN: 'LONDON',
      LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'COUNTY',
      POSTCODE: 'SW1A 2AA',
      UPRN: 104,
    })

    const expected: AddressWithoutTypeUPRN[] = [
      {
        addressLine1: 'PM ORG Downing Street',
        addressLine2: 'Sub Building Name',
        addressLine3: 'London',
        addressLine4: 'County',
        postcode: 'SW1A 2AA',
        uprn: 104,
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })

  it('correct if no throughfare name', () => {
    const data: OSDataHubPostcodeResponse = createData({
      BUILDING_NUMBER: 1,
      SUB_BUILDING_NAME: 'SUB BUILDING NAME',
      POST_TOWN: 'LONDON',
      LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'COUNTY',
      POSTCODE: 'SW1A 2AA',
      UPRN: 105,
    })

    const expected: AddressWithoutTypeUPRN[] = [
      {
        addressLine1: '1',
        addressLine2: 'Sub Building Name',
        addressLine3: 'London',
        addressLine4: 'County',
        postcode: 'SW1A 2AA',
        uprn: 105,
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })
})
