import { Order } from '../../models/Order'

export const ineligibleMonitoringMessages = {
  noFixedAbode: 'The device wearer has no fixed address so only Alcohol monitoring is allowed.',
  noFixedAbodeHomeOffice:
    'The device wearer has no fixed address so only Trail, Exclusion and Alcohol monitoring is allowed.',
  youthAlcohol: 'Alcohol monitoring is not allowed because the device wearer is a youth.',
}

const hasItems = (items?: unknown[] | null): boolean => (items?.length ?? 0) > 0

const getIneligibleMonitoringConditionsErrors = (order: Order): string[] => {
  const errors: string[] = []

  const hasCurfew = Boolean(order.curfewConditions)
  const hasAttendance = hasItems(order.mandatoryAttendanceConditions)

  if (order.deviceWearer?.noFixedAbode === true) {
    if (order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE') {
      if (hasCurfew || hasAttendance) {
        errors.push(ineligibleMonitoringMessages.noFixedAbodeHomeOffice)
      }
    } else if (
      hasCurfew ||
      hasAttendance ||
      hasItems(order.enforcementZoneConditions) ||
      Boolean(order.monitoringConditionsTrail)
    ) {
      errors.push(ineligibleMonitoringMessages.noFixedAbode)
    }
  }

  if (order.deviceWearer?.adultAtTimeOfInstallation === false && order.monitoringConditionsAlcohol) {
    errors.push(ineligibleMonitoringMessages.youthAlcohol)
  }

  return errors
}

export default getIneligibleMonitoringConditionsErrors
