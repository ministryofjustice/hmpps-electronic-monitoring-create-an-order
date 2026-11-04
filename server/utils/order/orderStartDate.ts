import { Order } from '../../models/Order'
import isVariationType from './isVariationType'

type StartDateOptions = {
  now?: Date
  treatMissingAsPast?: boolean
}

const isStartDateInPast = (order: Order, { now = new Date(), treatMissingAsPast = false }: StartDateOptions = {}) => {
  const startDate = order.monitoringConditions?.startDate
  if (!startDate) {
    return treatMissingAsPast
  }
  return new Date(startDate) < now
}

const isPastDatedVariation = (order: Order, options: StartDateOptions = {}) =>
  isVariationType(order.type) && isStartDateInPast(order, options)

const isPastDatedProbationVariation = (order: Order, options: StartDateOptions = {}) =>
  order.interestedParties?.notifyingOrganisation === 'PROBATION' && isPastDatedVariation(order, options)

export { isStartDateInPast, isPastDatedVariation, isPastDatedProbationVariation }
