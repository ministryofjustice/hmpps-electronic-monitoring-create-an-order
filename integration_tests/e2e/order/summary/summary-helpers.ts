import { v4 as uuidv4 } from 'uuid'
import { Order } from '../../../../server/models/Order'
import mockApiOrder from '../../../utils/data/ApiOrder'

type ApiOrder = ReturnType<typeof mockApiOrder>

export const stubCemoGetVersion = (override: Partial<ApiOrder> = {}) => {
  const id = override.id ?? uuidv4()
  const versionId = override.versionId ?? uuidv4()
  const status = override.status ?? 'IN_PROGRESS'
  const type = override.type ?? 'REQUEST'

  return cy.task('stubCemoGetVersion', {
    httpStatus: 200,
    id,
    versionId,
    status,
    type,
    order: {
      ...mockApiOrder(status, type),
      ...override,
      id,
      versionId,
      status,
      type,
    },
  })
}

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
