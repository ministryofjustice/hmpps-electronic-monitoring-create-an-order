import { Order } from '../../models/Order'
import isVariationType from './isVariationType'
import { notifyingOrganisationCourts } from '../../models/NotifyingOrganisation'

const OPTIONAL_VARIATION_ORGANISATIONS = [...notifyingOrganisationCourts, 'HOME_OFFICE']

const hasOptionalVariationSectionIsHOCourt = (order: Order): boolean => {
  if (
    isVariationType(order.type) &&
    OPTIONAL_VARIATION_ORGANISATIONS.includes(order.interestedParties?.notifyingOrganisation ?? '')
  ) {
    return true
  }
  return false
}

export default hasOptionalVariationSectionIsHOCourt
