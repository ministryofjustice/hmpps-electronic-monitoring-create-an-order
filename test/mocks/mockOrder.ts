import { randomUUID } from 'crypto'
import { DataDictionaryVersionEnum, Order, OrderStatusEnum, OrderTypeEnum } from '../../server/models/Order'
import { DeviceWearer } from '../../server/models/DeviceWearer'
import { MonitoringConditions } from '../../server/models/MonitoringConditions'
import { Address } from '../../server/models/Address'
import { ContactDetails } from '../../server/models/ContactDetails'
import { DeviceWearerResponsibleAdult } from '../../server/models/DeviceWearerResponsibleAdult'
import { InstallationAndRisk } from '../../server/models/InstallationAndRisk'
import { InterestedParties } from '../../server/models/InterestedParties'
import { EnforcementZone } from '../../server/models/EnforcementZone'
import { TrailMonitoring } from '../../server/models/TrailMonitoring'
import { AlcoholMonitoring } from '../../server/models/AlcoholMonitoring'
import { AttendanceMonitoring } from '../../server/models/AttendanceMonitoring'
import { CurfewReleaseDate } from '../../server/models/CurfewReleaseDate'
import { CurfewConditions } from '../../server/models/CurfewConditions'
import { CurfewTimetable } from '../../server/models/CurfewTimetable'
import { Attachment } from '../../server/models/Attachment'
import AttachmentType from '../../server/models/AttachmentType'

export const createDeviceWearer = (overrideProperties?: Partial<DeviceWearer>): DeviceWearer => ({
  nomisId: null,
  pncId: null,
  deliusId: null,
  prisonNumber: null,
  homeOfficeReferenceNumber: null,
  complianceAndEnforcementPersonReference: null,
  courtCaseReferenceNumber: null,
  firstName: null,
  lastName: null,
  alias: null,
  dateOfBirth: null,
  adultAtTimeOfInstallation: null,
  sex: null,
  gender: null,
  disabilities: [],
  noFixedAbode: null,
  interpreterRequired: null,
  ...overrideProperties,
})

export const createResponsibleAdult = (
  overrideProperties?: Partial<DeviceWearerResponsibleAdult>,
): DeviceWearerResponsibleAdult => ({
  contactNumber: null,
  fullName: null,
  otherRelationshipDetails: null,
  relationship: null,
  ...overrideProperties,
})

export const createContactDetails = (overrideProperties?: Partial<ContactDetails>): ContactDetails => ({
  contactNumber: '',
  ...overrideProperties,
})

export const createInstallationAndRisk = (overrideProperties?: Partial<InstallationAndRisk>): InstallationAndRisk => ({
  mappaCaseType: null,
  mappaLevel: null,
  riskCategory: null,
  riskDetails: null,
  offence: null,
  offenceAdditionalDetails: null,
  ...overrideProperties,
})

export const createInterestedParties = (overrideProperties?: Partial<InterestedParties>): InterestedParties => ({
  notifyingOrganisation: 'HOME_OFFICE',
  notifyingOrganisationName: '',
  notifyingOrganisationEmail: '',
  responsibleOfficerName: '',
  responsibleOfficerPhoneNumber: '',
  responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
  responsibleOrganisationEmail: '',
  responsibleOrganisationRegion: '',
  ...overrideProperties,
})

export const createAddress = (overrideProperties?: Partial<Address>): Address => ({
  addressType: 'PRIMARY',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  addressLine4: '',
  postcode: '',
  ...overrideProperties,
})

export const createEnforcementZoneCondition = (overrideProperties?: Partial<EnforcementZone>): EnforcementZone => ({
  description: null,
  duration: null,
  endDate: null,
  fileId: null,
  fileName: null,
  startDate: null,
  zoneId: null,
  zoneType: null,
  ...overrideProperties,
})

export const createMonitoringConditions = (
  overrideProperties?: Partial<MonitoringConditions>,
): MonitoringConditions => ({
  orderType: null,
  curfew: null,
  exclusionZone: null,
  trail: null,
  mandatoryAttendance: null,
  alcohol: null,
  orderTypeDescription: null,
  conditionType: null,
  startDate: null,
  endDate: null,
  sentenceType: null,
  issp: null,
  hdc: null,
  prarr: null,
  isValid: false,
  pilot: null,
  dapolMissedInError: null,
  offenceType: null,
  ...overrideProperties,
})

export const createMonitoringConditionsTrail = (overriddeProperties?: Partial<TrailMonitoring>): TrailMonitoring => ({
  startDate: null,
  endDate: null,
  ...overriddeProperties,
})

export const createMonitoringConditionsAlcohol = (
  overrideProperties?: Partial<AlcoholMonitoring>,
): AlcoholMonitoring => ({
  endDate: null,
  monitoringType: null,
  startDate: null,
  ...overrideProperties,
})

export const createMonitoringConditionsAttendance = (
  overrideProperties?: Partial<AttendanceMonitoring>,
): AttendanceMonitoring => ({
  addressLine1: null,
  addressLine2: null,
  addressLine3: null,
  addressLine4: null,
  appointmentDay: null,
  endDate: null,
  endTime: null,
  postcode: null,
  purpose: null,
  startDate: null,
  startTime: null,
  ...overrideProperties,
})

export const createCurfewReleaseDateConditions = (
  overrideProperties?: Partial<CurfewReleaseDate>,
): CurfewReleaseDate => ({
  curfewAddress: null,
  endTime: null,
  releaseDate: null,
  startTime: null,
  ...overrideProperties,
})

export const createCurfewConditions = (overrideProperties?: Partial<CurfewConditions>): CurfewConditions => ({
  endDate: null,
  startDate: null,
  curfewAdditionalDetails: null,
  ...overrideProperties,
})

export const createCurfewTimeTable = (overrideProperties?: Partial<CurfewTimetable>): CurfewTimetable => [
  {
    curfewAddress: '',
    dayOfWeek: '',
    endTime: '',
    startTime: '',
    ...overrideProperties,
  },
]

export const createAttatchment = (overrideProperties?: Partial<Attachment>): Attachment => {
  return { id: '', fileName: '', fileType: AttachmentType.LICENCE, ...overrideProperties }
}

export const getMockOrder = (overrideProperties?: Partial<Order>): Order => ({
  id: randomUUID(),
  status: OrderStatusEnum.Enum.IN_PROGRESS,
  type: OrderTypeEnum.Enum.REQUEST,
  dataDictionaryVersion: DataDictionaryVersionEnum.Enum.DDV4,
  deviceWearer: createDeviceWearer(),
  deviceWearerResponsibleAdult: null,
  contactDetails: null,
  installationAndRisk: null,
  interestedParties: null,
  enforcementZoneConditions: [],
  addresses: [],
  additionalDocuments: [],
  monitoringConditions: createMonitoringConditions(),
  monitoringConditionsTrail: null,
  mandatoryAttendanceConditions: [],
  monitoringConditionsAlcohol: null,
  variationDetails: null,
  isValid: false,
  probationDeliveryUnit: null,
  orderParameters: null,
  versionId: randomUUID(),
  dapoClauses: [],
  offences: [],
  ...overrideProperties,
})

export const getFilledMockOrder = (overrideProperties?: Partial<Order>): Order => ({
  id: randomUUID(),
  status: OrderStatusEnum.Enum.IN_PROGRESS,
  type: OrderTypeEnum.Enum.REQUEST,
  dataDictionaryVersion: DataDictionaryVersionEnum.Enum.DDV4,
  deviceWearer: {
    nomisId: '',
    pncId: null,
    deliusId: null,
    prisonNumber: null,
    homeOfficeReferenceNumber: null,
    complianceAndEnforcementPersonReference: null,
    courtCaseReferenceNumber: null,
    firstName: 'Test',
    lastName: 'Testson',
    alias: 'Test',
    dateOfBirth: null,
    adultAtTimeOfInstallation: null,
    sex: null,
    gender: null,
    disabilities: [],
    noFixedAbode: true,
    interpreterRequired: null,
  },
  deviceWearerResponsibleAdult: null,
  contactDetails: {
    contactNumber: '07123456489',
  },
  installationAndRisk: null,
  interestedParties: createInterestedParties(),
  probationDeliveryUnit: null,
  enforcementZoneConditions: [],
  addresses: [
    {
      addressType: 'INSTALLATION',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      postcode: '',
    },
  ],
  additionalDocuments: [createAttatchment()],
  monitoringConditions: createMonitoringConditions(),
  monitoringConditionsTrail: null,
  mandatoryAttendanceConditions: [],
  monitoringConditionsAlcohol: null,
  variationDetails: null,
  isValid: false,
  installationLocation: {
    location: 'INSTALLATION',
  },
  orderParameters: null,
  versionId: randomUUID(),
  // TODO: fill in with dummy data
  dapoClauses: [],
  offences: [],
  ...overrideProperties,
})

export const getMockSubmittedOrder = (overrideProperties?: Partial<Order>) => {
  return getMockOrder({ ...overrideProperties, status: OrderStatusEnum.Enum.SUBMITTED })
}
