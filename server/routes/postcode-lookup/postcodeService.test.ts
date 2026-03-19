import { AddressWithoutType } from '../../models/Address'
import PostcodeService from './postcodeService'

describe('postcode service', () => {
  describe('get addresses', () => {
    const addresses: AddressWithoutType[] = [
      {
        addressLine1: '10 Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AB',
      },
      {
        addressLine1: '11 Downing Street',
        addressLine2: '',
        addressLine3: 'London',
        addressLine4: '',
        postcode: 'SW1A 2AB',
      },
    ]

    const postcodeLookupStub = {
      lookup: jest.fn(),
    }

    it('formats address and postcode', async () => {
      postcodeLookupStub.lookup.mockResolvedValue(addresses)

      const service = new PostcodeService(postcodeLookupStub)

      const result = await service.lookupPostcode('SA11 1AA', 'PRIMARY')

      expect(result.length).toBe(2)
      expect(result).toContainEqual({ ...addresses[0], addressType: 'PRIMARY' })
      expect(postcodeLookupStub.lookup).toHaveBeenCalledWith('SA111AA')
    })

    it('filters addresses if given building id', async () => {
      postcodeLookupStub.lookup.mockResolvedValue(addresses)

      const service = new PostcodeService(postcodeLookupStub)

      const result = await service.lookupPostcode('SA11 1AA', 'PRIMARY', '10')

      expect(result.length).toBe(1)
    })
  })
})
