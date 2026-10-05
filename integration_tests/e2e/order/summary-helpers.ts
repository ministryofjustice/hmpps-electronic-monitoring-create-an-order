import { v4 as uuidv4 } from 'uuid'
import { Order } from '../../../server/models/Order'

const versionInformation = (override: Partial<Order>) => ({
  orderId: uuidv4(),
  versionId: uuidv4(),
  versionNumber: 0,
  submittedBy: 'John Smith',
  fmsResultDate: new Date(2025, 0, 1, 10, 30, 0, 0),
  type: 'REQUEST',
  status: 'SUBMITTED',
  notifyingOrganisation: 'PRISON',
  notifyingOrganisationName: 'WHITEMOOR_PRISON',
  ...override,
})

export default versionInformation
