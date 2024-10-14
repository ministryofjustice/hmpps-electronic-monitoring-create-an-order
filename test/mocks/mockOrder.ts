import { randomUUID } from 'crypto'
import { Order, OrderStatus, OrderStatusEnum } from '../../server/models/Order'

type MockOrderOptions = {
  id?: string
  status?: OrderStatus
}

export const getMockOrder = (options?: MockOrderOptions): Order => ({
  id: options?.id ?? randomUUID(),
  status: options?.status ?? OrderStatusEnum.Enum.IN_PROGRESS,
  deviceWearer: {
    nomisId: null,
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    firstName: null,
    lastName: null,
    alias: null,
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: [],
  },
  deviceWearerResponsibleAdult: null,
  deviceWearerContactDetails: {
    contactNumber: '',
  },
  enforcementZoneConditions: [],
  deviceWearerAddresses: [],
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
  },
  monitoringConditionsTrail: null,
})

export const getMockSubmittedOrder = (options?: MockOrderOptions) => ({
  ...getMockOrder(options),
  status: OrderStatusEnum.Enum.SUBMITTED,
})
