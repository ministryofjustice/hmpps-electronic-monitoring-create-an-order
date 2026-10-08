import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
import { OrderListInformation, OrderListInformationPage } from '../OrderListInformation'
import { emptyListMessages, OrderListView, OrderListViewEnum, orderListViewLabels } from './OrderListView'
import { OrderSearchResult } from '../OrderSearchResult'

type OrderListViewModel = {
  orders: {
    name: string
    href: string
    statusTags: { text: string; type: string }[]
    startDate?: string
    lastUpdatedBy?: string | null
    lastUpdatedDateTime: string
    index: number
  }[]
  emptyListMessage: string
  isPrisonOrYouthUser: boolean
  showViewFilter: boolean
  viewOptions: { value: OrderListView; text: string; selected: boolean }[]
  pagination?: {
    previous?: { text: string; href: string }
    next?: { text: string; href: string }
  }
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
  emptySearch?: boolean
  noResults?: boolean
  searchTerm?: string
}

function formatName(firstName?: string | null, lastName?: string | null): string {
  if (!firstName && !lastName) {
    return 'Not supplied'
  }

  return `${firstName || ''} ${lastName || ''}`
}

const formatDateTime = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const getYouthStatus = (order: OrderSearchResult): string => {
  const isMinor = order.deviceWearer?.adultAtTimeOfInstallation === false

  return isMinor ? 'Youth' : ''
}

const getIdList = (order: OrderSearchResult) => {
  const {
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    homeOfficeReferenceNumber,
    complianceAndEnforcementPersonReference,
    courtCaseReferenceNumber,
  } = order.deviceWearer
  const idList = [
    nomisId,
    pncId,
    deliusId,
    prisonNumber,
    homeOfficeReferenceNumber,
    complianceAndEnforcementPersonReference,
    courtCaseReferenceNumber,
  ].filter(id => id && id?.length > 0)
  return idList as string[]
}

const createOrderItem = (order: OrderSearchResult) => {
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)

  return {
    name: formatName(order.deviceWearer.firstName, order.deviceWearer.lastName),
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

export const constructSearchViewModel = (
  orders: Array<OrderSearchResult>,
  searchTerm: string,
): OrderSearchViewModel => {
  return {
    orders: orders.map(order => createOrderItem(order)),
    searchTerm,
  }
}

export function constructListViewModel(
  ordersPage: OrderListInformationPage,
  view: OrderListView,
  isPrisonOrYouthUser: boolean,
  availableViews: OrderListView[] = OrderListViewEnum.options,
): OrderListViewModel {
  const ordersWithTime = ordersPage.content.map(order => {
    const dateStr = order.monitoringConditions?.startDate
    return {
      order,
      time: dateStr ? Date.parse(dateStr) : null,
    }
  })

  ordersWithTime.sort((a, b) => {
    const aIsReturned = a.order.status === 'REJECTED'
    const bIsReturned = b.order.status === 'REJECTED'
    if (aIsReturned !== bIsReturned) return aIsReturned ? -1 : 1
    if (a.time === null && b.time === null) return 0
    if (a.time === null) return 1
    if (b.time === null) return -1
    return a.time - b.time
  })

  const pagination = ordersPage.page > 0 || ordersPage.hasNext ? constructPagination(ordersPage, view) : undefined

  return {
    orders: ordersWithTime.map(({ order }, index) => ({
      name: formatName(order.firstName, order.lastName),
      href: order.notifyingOrganisation
        ? paths.ORDER.SUMMARY.replace(':orderId', order.id)
        : paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', order.id),
      startDate: order.monitoringConditions?.startDate ? formatDateTime(order.monitoringConditions.startDate) : '',
      lastUpdatedBy: order.lastUpdatedBy,
      lastUpdatedDateTime: order.lastUpdatedDateTime ? formatDateTime(order.lastUpdatedDateTime) : '',
      statusTags: getStatusTags(order),
      index: ordersPage.page * ordersPage.size + index,
    })),
    isPrisonOrYouthUser,
    emptyListMessage: emptyListMessages[view],
    showViewFilter: availableViews.length > 1,
    viewOptions: availableViews.map(value => ({
      value,
      text: orderListViewLabels[value],
      selected: value === view,
    })),
    pagination,
  }
}

function constructPagination(ordersPage: OrderListInformationPage, view: OrderListView) {
  const pageHref = (page: number) => `/?view=${view}&page=${page}&size=${ordersPage.size}`
  return {
    previous: ordersPage.page > 0 ? { text: 'Previous', href: pageHref(ordersPage.page - 1) } : undefined,
    next: ordersPage.hasNext ? { text: 'Next', href: pageHref(ordersPage.page + 1) } : undefined,
  }
}

const getStatusTag = (status: OrderListInformation['status']) => {
  switch (status) {
    case 'IN_PROGRESS':
      return [{ text: 'Draft', type: 'DRAFT' }]
    case 'ERROR':
      return [{ text: 'Failed to submit', type: 'FAILED' }]
    case 'SUBMITTED':
      return [{ text: 'Submitted', type: 'SUBMITTED' }]

    default:
      return []
  }
}

const getStatusTags = (order: Pick<OrderListInformation, 'status' | 'type'>) => {
  const statusTags = []

  if (order.status === 'REJECTED') {
    statusTags.push({ text: 'Returned', type: 'RETURNED' })
  } else {
    if (order.type === 'VARIATION') {
      statusTags.push({ text: 'Change to form', type: 'VARIATION' })
    }
    statusTags.push(...getStatusTag(order.status))
  }

  return statusTags
}
