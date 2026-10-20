import { Order } from '../models/Order'
import { StatusUpdate } from '../models/StatusUpdate'

export const ORDER_CHANGE_STATUS_CHANGED_MESSAGE =
  'The status of this form has changed. Check its current status before making changes.'

const getLatestCurrentVersionStatusUpdate = (order: Order): StatusUpdate | undefined =>
  order.statusUpdates
    ?.filter(statusUpdate => statusUpdate.versionId === order.versionId)
    .reduce<StatusUpdate | undefined>((latest, statusUpdate) => {
      if (!latest || Date.parse(statusUpdate.datetimeOfStatusChange) > Date.parse(latest.datetimeOfStatusChange)) {
        return statusUpdate
      }
      return latest
    }, undefined)

export const isAcceptedOrderForChange = (order: Order): boolean =>
  order.canAmend && order.status === 'SUBMITTED' && getLatestCurrentVersionStatusUpdate(order)?.status === 'ACCEPTED'

export const shouldShowServiceRequestTypeQuestions = (order: Order): boolean => {
  const { startDate } = order.monitoringConditions
  return isAcceptedOrderForChange(order) && Boolean(startDate && Date.parse(startDate) <= Date.now())
}

export const canUseServiceRequestTypeFlow = (order: Order): boolean =>
  order.status === 'IN_PROGRESS' || shouldShowServiceRequestTypeQuestions(order)

export const canCreateOrderVersion = (order: Order): boolean => order.canAmend

export const getOrderChangeBlockedMessage = (): string =>
  "You can't make changes to this form because it is being processed by EMS. Try again later."

export const getServiceRequestTypeFlowBlockedMessage = (order: Order): string =>
  order.canAmend ? ORDER_CHANGE_STATUS_CHANGED_MESSAGE : getOrderChangeBlockedMessage()
