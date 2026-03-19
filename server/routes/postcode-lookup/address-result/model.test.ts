import { v4 as uuidv4 } from 'uuid'
import Model from './model'
import { Address } from '../../../models/Address'
import { createAddressPreview } from '../../../utils/utils'
import paths from '../../../constants/paths'

const mockOrderId = uuidv4()
describe('model', () => {
  const addresses: Address[] = [
    {
      addressType: 'PRIMARY',
      addressLine1: '10 Downing Street',
      addressLine2: '',
      addressLine3: 'London',
      addressLine4: '',
      postcode: 'SW1A 2AA',
    },
  ]

  it('gives correct model', () => {
    const model = Model.construct(addresses, { orderId: mockOrderId, addressType: 'PRIMARY', postcode: 'SW1A 2AA' })

    expect(model.items).toHaveLength(1)
    const expectedText = createAddressPreview(addresses[0])
    expect(model.items[0]).toEqual({ text: expectedText, value: '0' })
    expect(model.postcode).toBe('SW1A 2AA')
    expect(model.addressCount).toBe(1)
    expect(model.buildingId).toBeUndefined()

    expect(model.searchAgainLink).toBe(
      paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', mockOrderId).replace(':addressType', 'PRIMARY'),
    )
  })

  it('has buildingId if provided', async () => {
    const model = Model.construct(addresses, {
      orderId: mockOrderId,
      addressType: 'PRIMARY',
      postcode: 'SW1A 2AA',
      buildingId: '10',
    })
    expect(model.buildingId).toBe('10')
  })
})
