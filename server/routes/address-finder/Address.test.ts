import Address from './Address'

describe('Address', () => {
  it('creates Address from JSON', () => {
    const mockJson = {
      ADDRESS: 'PRIME MINISTER & FIRST LORD OF THE TREASURY, 10, DOWNING STREET, LONDON, SW1A 2AA',
      ORGANISATION_NAME: 'PRIME MINISTER & FIRST LORD OF THE TREASURY',
      BUILDING_NUMBER: '10',
      THOROUGHFARE_NAME: 'DOWNING STREET',
      POST_TOWN: 'LONDON',
      POSTCODE: 'SW1A 2AA',
      LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'CITY OF WESTMINSTER',
    }

    const address = Address.fromJson(mockJson)

    // we might want this to look different
    expect(address.displayText()).toBe(
      'Prime minister & first lord of the treasury, 10, downing street, london, sw1a 2aa',
    )
  })
})
