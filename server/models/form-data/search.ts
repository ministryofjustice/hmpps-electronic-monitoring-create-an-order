import config from '../../config'
import paths from '../../constants/paths'
import { Order } from '../Order'

type OrderListViewModel = {
  orders: Array<{
    displayName: string
    status: string
    type: string
    summaryUri: string
  }>
  variationsEnabled: boolean
}

export type OrderSearchViewModel = {
  orders: {
    text?: string | null | undefined
    html?: string
  }[][]
  variationsEnabled: boolean
  emptySearch?: boolean
  noResults?: boolean
  searchTerm?: string
}

function getDisplayName(order: Order): string {
  if (order.deviceWearer.firstName === null && order.deviceWearer.lastName === null) {
    if (order.type === 'VARIATION') {
      return 'New variation'
    }

    return 'New form'
  }

  return `${order.deviceWearer.firstName || ''} ${order.deviceWearer.lastName || ''}`
}

const formatDateTime = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const createOrderItem = (order: Order) => {
  const nameLink = `<a class="govuk-link" href=${paths.ORDER.SUMMARY.replace(':orderId', order.id)} >${getDisplayName(order)}</a>`
  return [
    {
      html: nameLink,
    },
    {
      text: order.deviceWearer.dateOfBirth ? formatDateTime(order.deviceWearer.dateOfBirth) : undefined,
    },
    {
      text: order.deviceWearer.pncId,
    },
    {
      text: 'blah',
    },
    {
      text: order.curfewConditions?.startDate ? formatDateTime(order.curfewConditions?.startDate) : undefined,
    },
    {
      text: order.curfewConditions?.endDate ? formatDateTime(order.curfewConditions?.endDate) : undefined,
    },
    {
      text: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    },
  ]
}

export const constructSearchViewModel = (orders: Array<Order>, searchTerm: string): OrderSearchViewModel => {
  return {
    orders: orders.map(order => createOrderItem(order)),
    variationsEnabled: config.variations.enabled,
    searchTerm,
  }
}

export function constructListViewModel(orders: Array<Order>): OrderListViewModel {
  return {
    orders: orders.map(order => {
      return {
        displayName: getDisplayName(order),
        status: order.status,
        type: order.type,
        summaryUri: paths.ORDER.SUMMARY.replace(':orderId', order.id),
      }
    }),
    variationsEnabled: config.variations.enabled,
  }
}
