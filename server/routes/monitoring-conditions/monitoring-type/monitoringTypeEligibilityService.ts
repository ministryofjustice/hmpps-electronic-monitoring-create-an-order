// eslint-disable-next-line max-classes-per-file
import { MonitoringConditions } from '../model'
import { Order } from '../../../models/Order'

export type MonitoringTypes = Pick<
  MonitoringConditions,
  'curfew' | 'exclusionZone' | 'trail' | 'mandatoryAttendance' | 'alcohol' | 'restrictionZone'
>

export type MonitoringTypeEligibility = {
  options: (keyof MonitoringTypes)[]
  message?: string
  exception?: boolean
}

export const eligibilityMessages = {
  hdcNoPilotUnknown:
    "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC) or part of any pilots.",
  hdcNoPilotGPS:
    "Some monitoring types can't be selected because the device wearer is not on a Home Detention Curfew (HDC).",
  hdcNoPilotGPSNoFixedAddress:
    'No monitoring types can be selected because the device wearer is not on a Home Detention Curfew (HDC) and has no fixed address.',
  noFixedAddress: "Some monitoring types can't be selected because the device wearer has no fixed address.",
  youthAlcoholExcluded:
    'Alcohol monitoring is not an option because the device wearer is not 18 years old or older when the electronic monitoring device is installed.',
}

export const eligibilityMessagesISR = {
  noFixedAddress: 'The device wearer has no fixed address so only Alcohol monitoring is allowed.',
  noFixedAddressHomeOffice:
    'The device wearer has no fixed address so only Trail monitoring and Exclusion zone monitoring is allowed.',
  youthAlcoholExcluded: 'Alcohol monitoring is not allowed because the device wearer is a youth.',
  youthNoFixedAddress: 'The device wearer has no fixed address and is a youth so no monitoring is allowed.',
}

const hasFixedAddress = (order: Order): boolean => {
  const primaryAddress = order.addresses.find(({ addressType }) => addressType === 'PRIMARY')
  return primaryAddress !== undefined
}

const isYouth = (order: Order): boolean => {
  return !order.deviceWearer.adultAtTimeOfInstallation
}

export class DefaultMonitoringEligibilityService {
  getEnabled(order: Order): MonitoringTypeEligibility {
    if (order.monitoringConditions.hdc === 'NO') {
      if (order.monitoringConditions.pilot === 'UNKNOWN') {
        return {
          options: ['alcohol'],
          message: eligibilityMessages.hdcNoPilotUnknown,
        }
      }
      if (order.monitoringConditions.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE') {
        if (!hasFixedAddress(order)) {
          return {
            options: [],
            message: eligibilityMessages.hdcNoPilotGPSNoFixedAddress,
            exception: true,
          }
        }
        return {
          options: ['trail'],
          message: eligibilityMessages.hdcNoPilotGPS,
        }
      }
    }

    if (!hasFixedAddress(order)) {
      if (order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE') {
        return {
          options: ['trail', 'exclusionZone', 'alcohol'],
          message: eligibilityMessages.noFixedAddress,
        }
      }
      return {
        options: ['alcohol'],
        message: eligibilityMessages.noFixedAddress,
      }
    }

    if (isYouth(order)) {
      return {
        options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance'],
        message: eligibilityMessages.youthAlcoholExcluded,
      }
    }

    return { options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol', 'restrictionZone'] }
  }
}

export class ISRMonitoringEligibilityService {
  getEnabled(order: Order): MonitoringTypeEligibility {
    const notifyingOrganisation = order.interestedParties?.notifyingOrganisation

    if (isYouth(order)) {
      if (!hasFixedAddress(order)) {
        return {
          options: [],
          message: eligibilityMessagesISR.youthNoFixedAddress,
          exception: true,
        }
      }
      return {
        options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance'],
        message: eligibilityMessagesISR.youthAlcoholExcluded,
      }
    }

    if (order.monitoringConditions.pilot === 'UNKNOWN') {
      if (!hasFixedAddress(order)) {
        return {
          options: ['alcohol'],
          message: eligibilityMessagesISR.noFixedAddress,
        }
      }
      return {
        options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol', 'restrictionZone'],
      }
    }

    if (order.monitoringConditions.pilot === 'GPS_ACQUISITIVE_CRIME_PAROLE') {
      if (!hasFixedAddress(order)) {
        return {
          options: ['alcohol'],
          message: eligibilityMessagesISR.noFixedAddress,
        }
      }
      return {
        options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol', 'restrictionZone'],
      }
    }

    if (!hasFixedAddress(order) && !isYouth(order)) {
      if (notifyingOrganisation === 'HOME_OFFICE') {
        return {
          options: ['trail', 'exclusionZone'],
          message: eligibilityMessagesISR.noFixedAddressHomeOffice,
        }
      }

      return {
        options: ['alcohol'],
        message: eligibilityMessagesISR.noFixedAddress,
      }
    }

    if (
      notifyingOrganisation?.includes('HOME_OFFICE') ||
      notifyingOrganisation?.includes('YOUTH') ||
      notifyingOrganisation?.includes('COURT')
    ) {
      return {
        options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'],
      }
    }

    return { options: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol', 'restrictionZone'] }
  }
}

const defaultEligibilityService = new DefaultMonitoringEligibilityService()
const newEligibilityService = new ISRMonitoringEligibilityService()

export const getMonitoringEligibilityService = (
  isrEnabled: boolean,
): DefaultMonitoringEligibilityService | ISRMonitoringEligibilityService =>
  isrEnabled ? newEligibilityService : defaultEligibilityService
