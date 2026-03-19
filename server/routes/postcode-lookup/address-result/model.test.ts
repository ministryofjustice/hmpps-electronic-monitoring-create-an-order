import Model from './model'
import { Address } from '../../../models/Address'
import { createAddressPreview } from '../../../utils/utils'

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

  const model = Model.construct(addresses, { postcode: 'SW1A 2AA' })

  it('has item list from addresses', () => {
    expect(model.items).toHaveLength(1)
    const expectedText = createAddressPreview(addresses[0])
    expect(model.items[0]).toEqual({ text: expectedText, value: '0' })
  })

  it('has label parameters', () => {
    expect(model.postcode).toBe('SW1A 2AA')
    expect(model.addressCount).toBe(1)
  })
})
