import { Order } from '../models/Order'

export const ORDER_CHANGE_STATUS_CHANGED_MESSAGE =
  'The status of this form has changed. Check its current status before making changes.'

export const isAcceptedOrderForChange = (order: Order): boolean =>
  order.status === 'SUBMITTED' && ['CLOSED', 'RESOLVED'].includes(order.caseState)

export const canCreateOrderVersion = (order: Order): boolean =>
  // allowing SUBMITTED order status with empty fmsResultId - assuming when null despite status due to fms status failure, unsure if we should block this case
  isAcceptedOrderForChange(order) ||
  (order.status === 'SUBMITTED' && order.caseState === 'UNKNOWN' && order.fmsResultId === null) ||
  ((order.status === 'SUBMITTED' || order.status === 'REJECTED') && order.caseState === 'CANCELLED')

export const getOrderChangeBlockedMessage = (order: Order): string => {
  if (order.caseState === 'UNKNOWN') {
    return "We can't check the status of this form right now. Try again later."
  }

  if (['NEW', 'OPEN', 'AWAITING_INFO', 'AWAITING_VALIDATION', 'AWAITING_APPROVAL'].includes(order.caseState)) {
    return 'This form is still being processed. You can make changes once it has been accepted or returned.'
  }

  return 'You cannot make changes to this form at this time.'
}
