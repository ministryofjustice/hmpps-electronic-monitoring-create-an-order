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

    const model = constructListViewModel(
      { content: [order], totalElements: 1, totalPages: 1, number: 0, size: 10 },
      'MY_ORDERS',
      true,
    )

    expect(model.orders).toEqual([
      {
        name: 'Not supplied',
        href: `/order/${order.id}/summary`,
        startDate: '',
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
    const model = constructListViewModel(
      { content: [getMockOrderListInformation({ status })], totalElements: 1, totalPages: 1, number: 0, size: 10 },
      'MY_ORDERS',
      true,
    )

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

    const model = constructListViewModel(
      { content: orders, totalElements: 3, totalPages: 1, number: 0, size: 10 },
      'MY_ORDERS',
      true,
    )

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

  it('should build pagination links with the selected view and API page numbers', () => {
    const orders = [getMockOrderListInformation()]

    const model = constructListViewModel(
      { content: orders, totalElements: 45, totalPages: 5, number: 2, size: 10 },
      'PRISON_ORDERS',
      true,
    )

    expect(model.pagination).toEqual({
      items: [
        { text: '1', href: '/?view=PRISON_ORDERS&page=0&size=10', selected: false },
        { text: '2', href: '/?view=PRISON_ORDERS&page=1&size=10', selected: false },
        { text: '3', href: '/?view=PRISON_ORDERS&page=2&size=10', selected: true },
        { text: '4', href: '/?view=PRISON_ORDERS&page=3&size=10', selected: false },
        { text: '5', href: '/?view=PRISON_ORDERS&page=4&size=10', selected: false },
      ],
      results: { count: 45, from: 21, to: 30, text: 'orders' },
      previous: { text: 'Previous', href: '/?view=PRISON_ORDERS&page=1&size=10' },
      next: { text: 'Next', href: '/?view=PRISON_ORDERS&page=3&size=10' },
    })
  })

  it('should hide pagination when the result count does not exceed the page size', () => {
    const model = constructListViewModel(
      { content: [], totalElements: 10, totalPages: 2, number: 0, size: 10 },
      'MY_ORDERS',
      false,
    )

    expect(model.pagination).toBeUndefined()
  })

  it('should sort returned orders before other statuses', () => {
    const orders = [
      getMockOrderListInformation({ firstName: 'Draft', lastName: 'Person', status: OrderStatusEnum.Enum.IN_PROGRESS }),
      getMockOrderListInformation({ firstName: 'Returned', lastName: 'Person', status: OrderStatusEnum.Enum.REJECTED }),
    ]

    const model = constructListViewModel(
      { content: orders, totalElements: 2, totalPages: 1, number: 0, size: 10 },
      'MY_ORDERS',
      false,
    )

    expect(model.orders.map(order => order.name)).toEqual(['Returned Person', 'Draft Person'])
    expect(model.orders[0].statusTags).toEqual([{ text: 'Returned', type: 'REJECTED' }])
  })
})
