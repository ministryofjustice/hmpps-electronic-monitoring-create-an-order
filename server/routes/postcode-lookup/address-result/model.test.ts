import Model from './model'
import { Address } from '../../../models/Address'
import { createAddressPreview } from '../../../utils/utils'

describe('model', () => {
  it('creates item list from addresses', () => {
    const addresses: Address[] = [
      {
        addressType: 'PRIMARY',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        postcode: '',
      },
    ]

    const model = Model.construct(addresses)

    expect(model.items).toHaveLength(1)
    const expectedText = createAddressPreview(addresses[0])
    expect(model.items[0]).toEqual({ text: expectedText, value: '0' })
  })
})
