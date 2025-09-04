import config from '../../config'
import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
import { Order } from '../Order'

type OrderListViewModel = {
  orders: {
    name: string
    href: string
    statusTags: { text: string; colour: string }[]
    index: number
  }[]
  variationAsNewOrderEnabled: boolean
}

export type OrderSearchViewModel = {
  orders: {
    text?: string | null | undefined
    html?: string
  }[][]
  variationAsNewOrderEnabled: boolean
  emptySearch?: boolean
  noResults?: boolean
  searchTerm?: string
}

function getDisplayName(order: Order): string {
  if (order.deviceWearer.firstName === null && order.deviceWearer.lastName === null) {
    return 'Not supplied'
  }

  return `${order.deviceWearer.firstName || ''} ${order.deviceWearer.lastName || ''}`
}

const formatDateTime = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const getIdList = (order: Order) => {
  const { nomisId, pncId, deliusId, homeOfficeReferenceNumber, prisonNumber } = order.deviceWearer
  const idList = [nomisId, pncId, deliusId, homeOfficeReferenceNumber, prisonNumber].filter(id => id && id?.length > 0)
  return idList.join('</br>')
}

const getNameLink = (order: Order) => {
  return `<a class="govuk-link" href=${paths.ORDER.SUMMARY.replace(':orderId', order.id)}>${getDisplayName(order)}</a>`
}

const createOrderItem = (order: Order) => {
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)
  return [
    {
      html: getNameLink(order),
    },
    {
      text: order.deviceWearer.dateOfBirth ? formatDateTime(order.deviceWearer.dateOfBirth) : undefined,
    },
    {
      html: getIdList(order),
    },
    {
      text: currentAddress?.addressLine3 ?? '',
    },
    {
      text: order.monitoringConditions?.startDate ? formatDateTime(order.monitoringConditions?.startDate) : undefined,
    },
    {
      text: order.monitoringConditions?.endDate ? formatDateTime(order.monitoringConditions?.endDate) : undefined,
    },
    {
      text: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : undefined,
    },
  ]
}

export const constructSearchViewModel = (orders: Array<Order>, searchTerm: string): OrderSearchViewModel => {
  return {
    orders: orders.map(order => createOrderItem(order)),
    variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
    searchTerm,
  }
}

export function constructListViewModel(orders: Array<Order>): OrderListViewModel {
  return {
    orders: orders.map((order, index) => ({
      name: getDisplayName(order),
      href: paths.ORDER.SUMMARY.replace(':orderId', order.id),
      statusTags: getStatusTags(order),
      index,
    })),
    variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
  }
}

const getStatusTags = (order: Order) => {
  const statusTags = []

  if (order.type === 'VARIATION') {
    statusTags.push({ text: 'Change to form', colour: 'blue' })
  }

  if (order.status === 'IN_PROGRESS') {
    statusTags.push({ text: 'Draft', colour: 'grey' })
  } else if (order.status === 'ERROR') {
    statusTags.push({ text: 'Failed to submit', colour: 'red' })
  } else if (order.status === 'SUBMITTED') {
    // Have to handle submitted orders until they are removed from list orders endpoint
    statusTags.push({ text: 'Submitted', colour: 'green' })
  }

  return statusTags
}
