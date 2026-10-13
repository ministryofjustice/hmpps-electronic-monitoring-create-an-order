import { Order } from '../models/Order'

export const ORDER_CHANGE_STATUS_CHANGED_MESSAGE =
  'The status of this form has changed. Check its current status before making changes.'

export const isAcceptedOrderForChange = (order: Order): boolean =>
  order.status === 'SUBMITTED' && order.caseState === 'AWAITING_VALIDATION'

export const canAmendReturnedOrder = (order: Order): boolean =>
  order.status === 'REJECTED' ||
  (order.status === 'SUBMITTED' && ['CANCELLED', 'CLOSED', 'RESOLVED'].includes(order.caseState))

export const canUseServiceRequestTypeFlow = (order: Order): boolean =>
  order.status === 'IN_PROGRESS' ||
  isAcceptedOrderForChange(order) ||
  (order.status === 'SUBMITTED' && order.caseState === 'UNKNOWN')

export const canCreateOrderVersion = (order: Order): boolean =>
  isAcceptedOrderForChange(order) ||
  canAmendReturnedOrder(order) ||
  (order.status === 'SUBMITTED' && order.caseState === 'UNKNOWN')

export const getOrderChangeBlockedMessage = (order: Order): string => {
  if (order.caseState === 'UNKNOWN') {
    return "We can't check the status of this form right now. Try again later."
  }

  if (['NEW', 'OPEN', 'AWAITING_INFO', 'AWAITING_APPROVAL'].includes(order.caseState)) {
    return 'This form is still being processed. You can make changes once it has been accepted or returned.'
  }

  return 'You cannot make changes to this form at this time.'
}
