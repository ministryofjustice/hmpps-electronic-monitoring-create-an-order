import { DeviceWearer } from '../../models/DeviceWearer'
import { NotifyingOrganisation } from '../../models/NotifyingOrganisation'
import { Order } from '../../models/Order'

const ORGANISATIONS_ASKING_RESPONSIBLE_ADULT_QUESTION: NotifyingOrganisation[] = [
  'YOUTH_CUSTODY_SERVICE',
  'YOUTH_COURT',
  'PRISON',
]

// The "Is a responsible adult required?" question is only asked for youth and prison orders.
export const shouldAskResponsibleAdultQuestion = (order: Pick<Order, 'interestedParties'>): boolean => {
  const notifyingOrganisation = order.interestedParties?.notifyingOrganisation
  return (
    notifyingOrganisation != null && ORGANISATIONS_ASKING_RESPONSIBLE_ADULT_QUESTION.includes(notifyingOrganisation)
  )
}

// adultAtTimeOfInstallation is the inverse of "is a responsible adult required?". The API clears any responsible adult
// details when it is true, and sends responsible_adult_required=false to FMS when there are no responsible adult details.
export const NO_RESPONSIBLE_ADULT_REQUIRED: Pick<DeviceWearer, 'adultAtTimeOfInstallation'> = {
  adultAtTimeOfInstallation: true,
}
