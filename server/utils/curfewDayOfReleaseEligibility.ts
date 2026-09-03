import { Order } from '../models/Order'

const isPrisonOrYouthOrder = (order: Order): boolean => {
  const { notifyingOrganisation } = order.interestedParties ?? {}
  return notifyingOrganisation === 'PRISON' || notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE'
}

const isStartDateInThePast = (order: Order): boolean => {
  const { startDate } = order.monitoringConditions
  if (!startDate) {
    return false
  }
  return new Date(startDate) < new Date()
}

const shouldShowCurfewDayOfRelease = (order: Order): boolean => {
  return isPrisonOrYouthOrder(order) && !isStartDateInThePast(order)
}

export default shouldShowCurfewDayOfRelease
