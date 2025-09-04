import config from '../../config'
import paths from '../../constants/paths'
import { AddressTypeEnum } from '../Address'
import { Order } from '../Order'

type OrderListViewModel = {
  orders: {
    text?: string | null | undefined
    html?: string
  }[][]
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

const getNameLink = (order: Order, index?: number) => {
  if (index !== undefined) {
    return `<a class="govuk-link" aria-describedby="order-${index}-status" href=${paths.ORDER.SUMMARY.replace(':orderId', order.id)}>${getDisplayName(order)}</a>`
  }
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
    orders: orders.map((order, i) => {
      return [
        {
          html: getNameLink(order, i),
        },
        { html: getStatusTags(order, i) },
      ]
    }),
    variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
  }
}

const getStatusTags = (order: Order, index: number): string => {
  let statusTags = ''
  if (order.type === 'VARIATION') {
    statusTags += `<strong class="govuk-tag govuk-tag--blue govuk-!-margin-right-2">Change to form</strong>`
  }
  if (order.status === 'IN_PROGRESS') {
    statusTags += `<strong class="govuk-tag govuk-tag--grey govuk-!-margin-right-2">Draft</strong>`
  } else if (order.status === 'ERROR') {
    statusTags += `<strong class="govuk-tag govuk-tag--red govuk-!-margin-right-2">Failed to submit</strong>`
  } else if (order.status === 'SUBMITTED') {
    // Have to handle submitted orders until they are removed from list orders endpoint
    statusTags += `<strong class="govuk-tag govuk-tag--green govuk-!-margin-right-2">Submitted</strong>`
  }
  return `<div id="order-${index}-status">${statusTags}</div>`
}
