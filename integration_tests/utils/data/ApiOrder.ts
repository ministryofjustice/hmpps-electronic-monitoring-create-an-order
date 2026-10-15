import { v4 as uuidv4 } from 'uuid'
import { Order } from '../../../server/models/Order'

type ApiOrder = Omit<Order, 'deviceWearer'> & {
  deviceWearer: Omit<Order['deviceWearer'], 'disabilities'> & {
    disabilities: string
  }
}

const mockApiOrder = (status: Order['status'] = 'IN_PROGRESS', type: Order['type'] = 'REQUEST'): ApiOrder => {
  const versionId = uuidv4()
  return {
    id: uuidv4(),
    status,
    canAmend: status === 'SUBMITTED' || status === 'REJECTED',
    ...(status === 'SUBMITTED'
      ? {
          statusUpdates: [
            {
              id: uuidv4(),
              versionId,
              status: 'ACCEPTED' as const,
              datetimeOfStatusChange: '2025-01-01T12:00:00.000Z',
              statusUpdateReasons: [],
            },
          ],
        }
      : {}),
    type,
    dataDictionaryVersion: 'DDV4',
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      homeOfficeReferenceNumber: null,
      complianceAndEnforcementPersonReference: null,
      courtCaseReferenceNumber: null,
      firstName: null,
      middleName: null,
      lastName: null,
      alias: null,
      dateOfBirth: null,
      adultAtTimeOfInstallation: null,
      sex: null,
      gender: null,
      disabilities: '',
      noFixedAbode: null,
      interpreterRequired: null,
    },
    deviceWearerResponsibleAdult: null,
    enforcementZoneConditions: [],
    addresses: [],
    contactDetails: null,
    installationAndRisk: null,
    probationDeliveryUnit: null,
    interestedParties: null,
    additionalDocuments: [],
    monitoringConditions: {
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
      pilot: null,
      dapolMissedInError: null,
      offenceType: null,
      isValid: false,
    },
    monitoringConditionsTrail: null,
    monitoringConditionsAlcohol: null,
    mandatoryAttendanceConditions: [],
    variationDetails: null,
    isValid: false,
    orderParameters: null,
    versionId,
    dapoClauses: [],
    offences: [],
    mappa: null,
    offenceAdditionalDetails: null,
    isOwner: true,
  }
}

export default mockApiOrder
