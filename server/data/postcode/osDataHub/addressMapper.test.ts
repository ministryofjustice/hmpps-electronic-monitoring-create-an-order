import { AddressWithoutType } from '../../../models/Address'
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
    })

    const expected: AddressWithoutType[] = [
      {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
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
    })

    const expected: AddressWithoutType[] = [
      {
        addressLine1: 'PM HOUSE Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
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
    })

    const expected: AddressWithoutType[] = [
      {
        addressLine1: 'PM ORG Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AA',
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
    })

    const expected: AddressWithoutType[] = [
      {
        addressLine1: 'PM ORG Downing Street',
        addressLine2: 'Sub Building Name',
        addressLine3: 'London',
        addressLine4: 'County',
        postcode: 'SW1A 2AA',
      },
    ]

    const result = addressMapper.mapToAddresses(data)

    expect(result).toEqual(expected)
  })
})
