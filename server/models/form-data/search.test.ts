import { getMockOrderListInformation } from '../../../test/mocks/mockOrder'
import { OrderStatusEnum, OrderTypeEnum } from '../Order'
import { constructListViewModel } from './search'

describe('constructListViewModel', () => {
  it('should map an order to a list item', () => {
    const order = getMockOrderListInformation({
      notifyingOrganisation: 'PRISON',
      lastUpdatedBy: 'CEMO.USER',
      lastUpdatedDateTime: '2024-03-10T11:30:00.000Z',
    })

    const model = constructListViewModel([order], 'MY_ORDERS', true)

    expect(model.orders).toEqual([
      {
        name: 'Not supplied',
        href: `/order/${order.id}/summary`,
        lastUpdatedBy: 'CEMO.USER',
        lastUpdatedDateTime: '10/3/2024',
        statusTags: [{ text: 'Draft', type: 'DRAFT' }],
        index: 0,
      },
    ])
  })

  it.each([
    [OrderStatusEnum.Enum.IN_PROGRESS, [{ text: 'Draft', type: 'DRAFT' }]],
    [OrderStatusEnum.Enum.ERROR, [{ text: 'Failed to submit', type: 'FAILED' }]],
    [OrderStatusEnum.Enum.SUBMITTED, [{ text: 'Submitted', type: 'SUBMITTED' }]],
  ])('should create the correct status tags for a %s order', (status, expectedTags) => {
    const model = constructListViewModel([getMockOrderListInformation({ status })], 'MY_ORDERS', true)

    expect(model.orders[0].statusTags).toEqual(expectedTags)
  })

  it('should map every order in the list with sequential indexes', () => {
    const orders = [
      getMockOrderListInformation({ firstName: 'Alice', lastName: 'One', notifyingOrganisation: 'PRISON' }),
      getMockOrderListInformation({
        firstName: 'Bob',
        lastName: 'Two',
        status: OrderStatusEnum.Enum.ERROR,
        notifyingOrganisation: 'PRISON',
      }),
      getMockOrderListInformation({
        firstName: 'Carol',
        lastName: 'Three',
        type: OrderTypeEnum.Enum.VARIATION,
        notifyingOrganisation: 'PRISON',
      }),
    ]

    const model = constructListViewModel(orders, 'MY_ORDERS', true)

    expect(model.orders).toHaveLength(3)
    expect(model.orders.map(order => order.name)).toEqual(['Alice One', 'Bob Two', 'Carol Three'])
    expect(model.orders.map(order => order.index)).toEqual([0, 1, 2])
    expect(model.orders.map(order => order.href)).toEqual([
      `/order/${orders[0].id}/summary`,
      `/order/${orders[1].id}/summary`,
      `/order/${orders[2].id}/summary`,
    ])
    expect(model.orders.map(order => order.statusTags)).toEqual([
      [{ text: 'Draft', type: 'DRAFT' }],
      [{ text: 'Failed to submit', type: 'FAILED' }],
      [
        { text: 'Change to form', type: 'VARIATION' },
        { text: 'Draft', type: 'DRAFT' },
      ],
    ])
  })
})
