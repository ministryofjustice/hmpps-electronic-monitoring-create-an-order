import { v4 as uuidv4 } from 'uuid'
import InterestedPartiesStoreService from './interestedPartiesStoreService'
import { InterestedParties } from './model'
import InMemoryStore from '../store/inMemoryStore'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { Order } from '../../models/Order'

describe('store service', () => {
  let store: InMemoryStore
  let service: InterestedPartiesStoreService
  const mockOrderId = uuidv4()
  let mockOrder: Order

  beforeEach(() => {
    store = new InMemoryStore()
    service = new InterestedPartiesStoreService(store)
    mockOrder = getMockOrder({ id: mockOrderId })
  })

  describe('clearing down data', () => {
    let oldData: InterestedParties

    beforeEach(async () => {
      await service.updateNotifyingOrganisation(mockOrder, {
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@b.com',
      })
      await service.UpdateResponsibleOfficer(mockOrder, {
        responsibleOfficerFirstName: 'fName',
        responsibleOfficerLastName: 'lName',
        responsibleOfficerEmail: 'fName@b.com',
      })
      await service.updateResponsibleOrganisation(mockOrder, {
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationRegion: 'CHESHIRE',
        responsibleOrganisationEmail: 'probation@b.com',
      })

      oldData = await service.getInterestedParties(mockOrder)
    })

    it('notifyingOrganisation', async () => {
      await service.updateNotifyingOrganisation(mockOrder, {
        notifyingOrganisation: 'CROWN_COURT',
        notifyingOrganisationName: 'LEEDS_CROWN_COURT',
        notifyingOrganisationEmail: 'court@no.com',
      })

      const newData = await service.getInterestedParties(mockOrder)

      const expectedData: InterestedParties = {
        notifyingOrganisation: 'CROWN_COURT',
        notifyingOrganisationName: 'LEEDS_CROWN_COURT',
        notifyingOrganisationEmail: 'court@no.com',
        responsibleOfficerFirstName: undefined,
        responsibleOfficerLastName: undefined,
        responsibleOfficerEmail: undefined,
        responsibleOrganisation: undefined,
        responsibleOrganisationRegion: undefined,
        responsibleOrganisationEmail: undefined,
      }

      expect(newData).toEqual(expectedData)
    })

    it('does not clear data if same value', async () => {
      await service.updateNotifyingOrganisation(mockOrder, {
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'a@b.com',
      })

      const newData = await service.getInterestedParties(mockOrder)

      const expectedData: InterestedParties = {
        ...oldData,
        notifyingOrganisationEmail: 'a@b.com',
      }

      expect(newData).toEqual(expectedData)
    })
  })
})
