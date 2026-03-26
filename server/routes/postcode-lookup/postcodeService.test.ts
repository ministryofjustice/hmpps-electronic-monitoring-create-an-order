import { AddressWithoutTypeUPRN } from '../../models/Address'
import PostcodeService from './postcodeService'

describe('postcode service', () => {
  const addresses: AddressWithoutTypeUPRN[] = [
    {
      addressLine1: '10 Downing Street',
      addressLine2: '',
      addressLine3: 'London',
      addressLine4: '',
      postcode: 'SW1A 2AB',
      uprn: '101',
    },
    {
      addressLine1: '11 Downing Street',
      addressLine2: '',
      addressLine3: 'London',
      addressLine4: '',
      postcode: 'SW1A 2AB',
      uprn: '102',
    },
  ]

  const postcodeLookupStub = {
    lookupByPostcode: jest.fn(),
    lookupByUPRN: jest.fn(),
  }
  describe('get addresses by postcode', () => {
    it('formats address and postcode', async () => {
      postcodeLookupStub.lookupByPostcode.mockResolvedValue(addresses)

      const service = new PostcodeService(postcodeLookupStub)

      const result = await service.lookupByPostcode('   SA11  1AA  ', 'PRIMARY')

      expect(result.length).toBe(2)
      expect(result).toContainEqual({ ...addresses[0], addressType: 'PRIMARY' })
      expect(postcodeLookupStub.lookupByPostcode).toHaveBeenCalledWith('SA111AA')
    })

    it('filters addresses if given building id', async () => {
      postcodeLookupStub.lookupByPostcode.mockResolvedValue(addresses)

      const service = new PostcodeService(postcodeLookupStub)

      const result = await service.lookupByPostcode('SA11 1AA', 'PRIMARY', '10')

      expect(result.length).toBe(1)
    })
  })

  describe('get address by uprn', () => {
    it('returns addresses', async () => {
      postcodeLookupStub.lookupByUPRN.mockResolvedValue(addresses[0])
      const service = new PostcodeService(postcodeLookupStub)

      const result = await service.lookupByUPRN('101')

      expect(result).toEqual(addresses[0])
      expect(postcodeLookupStub.lookupByUPRN).toHaveBeenCalledWith('101')
    })
  })
})
