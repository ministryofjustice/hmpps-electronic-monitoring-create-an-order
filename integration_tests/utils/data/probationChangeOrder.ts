import { v4 as uuidv4 } from 'uuid'
import mockApiOrder from './ApiOrder'

const PAST_START_DATE = '2025-01-01T00:00:00.000Z'
const FUTURE_START_DATE = '2040-01-01T00:00:00.000Z'

type ProbationChangeOptions = {
  id: string
  startDate?: string
  status?: string
  type?: string
  haveLicence?: boolean | null
  licenceFileName?: string
}

const probationChangeOrderStub = ({
  id,
  startDate = PAST_START_DATE,
  status = 'IN_PROGRESS',
  type = 'VARIATION',
  haveLicence = null,
  licenceFileName,
}: ProbationChangeOptions) => {
  const defaults = mockApiOrder()
  return {
    httpStatus: 200,
    id,
    status,
    type,
    order: {
      interestedParties: {
        notifyingOrganisation: 'PROBATION',
        notifyingOrganisationName: 'NORTH_EAST',
        notifyingOrganisationEmail: 'notifying@organisation',
        responsibleOfficerFirstName: 'John',
        responsibleOfficerLastName: 'Smith',
        responsibleOfficerEmail: 'officer@email',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: '',
        responsibleOrganisationRegion: 'NORTH_EAST',
      },
      monitoringConditions: { ...defaults.monitoringConditions, startDate },
      orderParameters: { havePhoto: false, haveLicence },
      additionalDocuments: licenceFileName
        ? [{ id: uuidv4(), orderId: id, fileName: licenceFileName, fileType: 'LICENCE' }]
        : [],
      fmsResultDate: new Date('2025-02-01'),
    },
  }
}

export { probationChangeOrderStub, PAST_START_DATE, FUTURE_START_DATE }
