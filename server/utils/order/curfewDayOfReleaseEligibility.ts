import { Order } from '../../models/Order'
import { isStartDateInPast } from './orderStartDate'

const isPrisonOrYouthOrder = (order: Order): boolean => {
  const { notifyingOrganisation } = order.interestedParties ?? {}
  return notifyingOrganisation === 'PRISON' || notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE'
}

const shouldShowCurfewDayOfRelease = (order: Order): boolean => {
  return isPrisonOrYouthOrder(order) && !isStartDateInPast(order)
}

export default shouldShowCurfewDayOfRelease
