import { randomUUID } from 'crypto'
import { Order, OrderStatusEnum } from '../../server/models/Order'

export const getMockOrder = (overrideProperties?: Partial<Order>): Order => ({
  id: randomUUID(),
  status: OrderStatusEnum.Enum.IN_PROGRESS,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: [],
    noFixedAbode: null,
  },
  deviceWearerResponsibleAdult: null,
  contactDetails: null,
  installationAndRisk: null,
  interestedParties: null,
  enforcementZoneConditions: [],
  addresses: [],
  additionalDocuments: [],
  monitoringConditions: {
    orderType: null,
    acquisitiveCrime: null,
    dapol: null,
    curfew: null,
    exclusionZone: null,
    trail: null,
    mandatoryAttendance: null,
    alcohol: null,
    devicesRequired: null,
    orderTypeDescription: null,
    conditionType: null,
    startDate: null,
    endDate: null,
  },
  monitoringConditionsTrail: null,
  monitoringConditionsAlcohol: null,
  isValid: false,
  ...overrideProperties,
})

export const getMockSubmittedOrder = (overrideProperties?: Partial<Order>) => {
  return getMockOrder({ ...overrideProperties, status: OrderStatusEnum.Enum.SUBMITTED })
}
