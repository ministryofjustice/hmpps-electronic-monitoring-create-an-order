import config from '../../config'
import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
import { Order } from '../Order'

type OrderListViewModel = {
  orders: {
    name: string
    href: string
    statusTags: { text: string; type: string }[]
    index: number
  }[]
  variationAsNewOrderEnabled: boolean
}

export type OrderSearchViewModel = {
  orders: {
    name: string
    href: string
    dob: string
    pins: string[]
    location: string
    startDate: string
    endDate: string
    lastUpdated: string
  }[]
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
  return idList as string[]
}

const createOrderItem = (order: Order) => {
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)

  return {
    name: getDisplayName(order),
    href: paths.ORDER.SUMMARY.replace(':orderId', order.id),
    dob: order.deviceWearer.dateOfBirth ? formatDateTime(order.deviceWearer.dateOfBirth) : '',
    pins: getIdList(order),
    location: currentAddress?.addressLine3 ?? '',
    startDate: order.monitoringConditions?.startDate ? formatDateTime(order.monitoringConditions?.startDate) : '',
    endDate: order.monitoringConditions?.endDate ? formatDateTime(order.monitoringConditions?.endDate) : '',
    lastUpdated: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : '',
  }
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
    statusTags.push({ text: 'Change to form', type: 'VARIATION' })
  }

  if (order.status === 'IN_PROGRESS') {
    statusTags.push({ text: 'Draft', type: 'DRAFT' })
  } else if (order.status === 'ERROR') {
    statusTags.push({ text: 'Failed to submit', type: 'FAILED' })
  }

  return statusTags
}
