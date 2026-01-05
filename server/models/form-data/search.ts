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

const getEarliestStartDate = (order: Order): string | null => {
  const dates: (string | null)[] = [
    order.monitoringConditions?.startDate ?? null,
    order.curfewConditions?.startDate ?? null,
    order.monitoringConditionsTrail?.startDate ?? null,
    order.monitoringConditionsAlcohol?.startDate ?? null,
    ...(order.mandatoryAttendanceConditions?.map(condition => condition.startDate) ?? []),
    ...(order.enforcementZoneConditions?.map(condition => condition.startDate) ?? []),
  ]

  const validDates = dates.filter(date => date !== null).map(date => new Date(date))

  if (validDates.length === 0) {
    return null
  }

  const earliestDate = new Date(Math.min(...validDates.map(date => date.getTime())))
  return earliestDate.toISOString()
}

const getLatestEndDate = (order: Order): string | null => {
  const dates: (string | null | undefined)[] = [
    order.monitoringConditions?.endDate ?? null,
    order.curfewConditions?.endDate ?? null,
    order.monitoringConditionsTrail?.endDate ?? null,
    order.monitoringConditionsAlcohol?.endDate ?? null,
    ...(order.mandatoryAttendanceConditions?.map(condition => condition.endDate) ?? []),
    ...(order.enforcementZoneConditions?.map(condition => condition.endDate) ?? []),
  ]

  const validDates = dates.filter(date => date !== null && date !== undefined).map(date => new Date(date))

  if (validDates.length === 0) {
    return null
  }

  const latestDate = new Date(Math.max(...validDates.map(date => date.getTime())))
  return latestDate.toISOString()
}

const createOrderItem = (order: Order) => {
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)
  const earliestStartDate = getEarliestStartDate(order)
  const latestEndDate = getLatestEndDate(order)

  return {
    name: getDisplayName(order),
    href: paths.ORDER.SUMMARY.replace(':orderId', order.id),
    dob: order.deviceWearer.dateOfBirth ? formatDateTime(order.deviceWearer.dateOfBirth) : '',
    pins: getIdList(order),
    location: currentAddress?.addressLine3 ?? '',
    startDate: earliestStartDate ? formatDateTime(earliestStartDate) : '',
    endDate: latestEndDate ? formatDateTime(latestEndDate) : '',
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
