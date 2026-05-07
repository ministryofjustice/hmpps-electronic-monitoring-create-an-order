import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'
import ViewModel from './viewModel'

describe('view model', () => {
  it('should not count an installation address as a device wearer address', () => {
    const order = getMockOrder({
      addresses: [
        createAddress({ addressType: 'PRIMARY' }),
        createAddress({ addressType: 'SECONDARY' }),
        createAddress({ addressType: 'INSTALLATION' }),
      ],
    })

    const model = ViewModel.construct(order, [])

    expect(model.items).toHaveLength(2)
    expect(model.showAddAnother).toBe(true)
  })
})
