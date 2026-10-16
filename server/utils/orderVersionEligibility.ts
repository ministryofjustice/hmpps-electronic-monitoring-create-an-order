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

export const canUseServiceRequestTypeFlow = (order: Order): boolean =>
  order.status === 'IN_PROGRESS' || isAcceptedOrderForChange(order)

export const canCreateOrderVersion = (order: Order): boolean => order.canAmend

export const getOrderChangeBlockedMessage = (): string =>
  "We can't check the status of this form right now. Try again later."
