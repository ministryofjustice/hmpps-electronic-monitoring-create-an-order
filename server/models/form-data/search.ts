import config from '../../config'
import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
import { Order } from '../Order'
import { OrderListInformation } from '../OrderListInformation'
import { OrderListView, OrderListViewEnum, orderListViewLabels } from './OrderListView'

type OrderListViewModel = {
  orders: {
    name: string
    href: string
    statusTags: { text: string; type: string }[]
    lastUpdatedBy?: string | null
    lastUpdatedDateTime: string
    index: number
  }[]
  variationAsNewOrderEnabled: boolean
  isPrisonOrYouthUser: boolean
  viewOptions: { value: OrderListView, text: string, selected: boolean}[]
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

function getDisplayName(order: OrderListInformation): string {
  if (order.deviceWearer.firstName === null && order.deviceWearer.lastName === null) {
    return 'Not supplied'
  }

  return `${order.deviceWearer.firstName || ''} ${order.deviceWearer.lastName || ''}`
}

const formatDateTime = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const getYouthStatus = (order: Order): string => {
  const isMinor = order.deviceWearer?.adultAtTimeOfInstallation === false

  return isMinor ? 'Youth' : ''
}

const getIdList = (order: Order) => {
  const { nomisId, pncId, deliusId, prisonNumber, complianceAndEnforcementPersonReference, courtCaseReferenceNumber } =
    order.deviceWearer
  const idList = [
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    complianceAndEnforcementPersonReference,
    courtCaseReferenceNumber,
  ].filter(id => id && id?.length > 0)
  return idList as string[]
}

const createOrderItem = (order: Order) => {
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)

  return {
    name: getDisplayName(order),
    href: paths.ORDER.SUMMARY.replace(':orderId', order.id),
    dob: order.deviceWearer.dateOfBirth ? formatDateTime(order.deviceWearer.dateOfBirth) : '',
    youth: getYouthStatus(order),
    pins: getIdList(order),
    location: currentAddress?.addressLine3 ?? '',
    startDate: order.monitoringConditions?.startDate ? formatDateTime(order.monitoringConditions?.startDate) : '',
    endDate: order.monitoringConditions?.endDate ? formatDateTime(order.monitoringConditions?.endDate) : '',
    lastUpdated: order.fmsResultDate ? formatDateTime(order.fmsResultDate) : '',
    statusTags: getStatusTag(order.status),
  }
}

export const constructSearchViewModel = (orders: Array<Order>, searchTerm: string): OrderSearchViewModel => {
  return {
    orders: orders.map(order => createOrderItem(order)),
    variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
    searchTerm,
  }
}

export function constructListViewModel(orders: OrderListInformation[], view: OrderListView, isPrisonOrYouthUser: boolean): OrderListViewModel {
  return {
    orders: orders.map((order, index) => ({
      name: getDisplayName(order),
      href: order.interestedParties?.notifyingOrganisation
        ? paths.ORDER.SUMMARY.replace(':orderId', order.id)
        : paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', order.id),
      lastUpdatedBy: order.lastUpdatedBy,
      lastUpdatedDateTime: order.lastUpdatedDateTime ? formatDateTime(order.lastUpdatedDateTime) : '',
      statusTags: getStatusTags(order),
      index,
    })),
    variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
    isPrisonOrYouthUser,
    viewOptions: OrderListViewEnum.options.map(value => ({
      value,
      text: orderListViewLabels[value],
      selected: value === view,
})),
  }
}

const getStatusTag = (status: OrderListInformation['status']) => {
  if (status === 'IN_PROGRESS') {
    return [{ text: 'Draft', type: 'DRAFT' }]
  }
  if (status === 'ERROR') {
    return [{ text: 'Failed to submit', type: 'FAILED' }]
  }
  if (status === 'SUBMITTED') {
    return [{ text: 'Submitted', type: 'SUBMITTED' }]
  }
  return []
}

const getStatusTags = (order: Pick<OrderListInformation, 'status' | 'type'>) => {
  const statusTags = []

  if (order.type === 'VARIATION') {
    statusTags.push({ text: 'Change to form', type: 'VARIATION' })
  }
  /*
  if (order.status === 'IN_PROGRESS') {
    statusTags.push({ text: 'Draft', type: 'DRAFT' })
  } else if (order.status === 'ERROR') {
    statusTags.push({ text: 'Failed to submit', type: 'FAILED' })
  }*/
  statusTags.push(...getStatusTag(order.status))
  return statusTags
}
