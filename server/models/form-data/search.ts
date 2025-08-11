import config from '../../config'
import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
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

const getIdList = (order: Order) => {
  const { nomisId, pncId, deliusId, homeOfficeReferenceNumber, prisonNumber } = order.deviceWearer
  const idList = [nomisId, pncId, deliusId, homeOfficeReferenceNumber, prisonNumber].filter(id => id && id?.length > 0)
  return idList.join('</br>')
}

const createOrderItem = (order: Order) => {
  const nameLink = `<a class="govuk-link" href=${paths.ORDER.SUMMARY.replace(':orderId', order.id)} >${getDisplayName(order)}</a>`
  const currentAddress = order.addresses.find(address => address.addressType === AddressTypeEnum.Values.PRIMARY)
  return [
    {
      html: nameLink,
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
