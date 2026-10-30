import { createDeviceWearer, createInterestedParties, getMockOrder } from '../../../test/mocks/mockOrder'
import RestClient from '../../data/restClient'
import { NotifyingOrganisation } from '../../models/NotifyingOrganisation'
import InMemoryStore from '../store/inMemoryStore'
import DeviceWearerAnswersService from './deviceWearerAnswersService'
import DeviceWearerStoreService from './store/deviceWearerStoreService'

jest.mock('../../data/restClient')

const orderFrom = (notifyingOrganisation: NotifyingOrganisation) =>
  getMockOrder({
    interestedParties: createInterestedParties({ notifyingOrganisation }),
    deviceWearer: createDeviceWearer({
      firstName: 'Jo',
      lastName: 'Bloggs',
      disabilities: ['VISION'],
      adultAtTimeOfInstallation: false,
    }),
  })

describe('DeviceWearerAnswersService', () => {
  let apiClient: jest.Mocked<RestClient>
  let service: DeviceWearerAnswersService

  beforeEach(() => {
    apiClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    service = new DeviceWearerAnswersService(new DeviceWearerStoreService(new InMemoryStore()), apiClient)
  })

  describe('saveLanguage', () => {
    it('saves the interpreter language when an interpreter is needed', async () => {
      await service.saveLanguage(order, { interpreterRequired: true, language: 'Arabic' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.interpreterRequired).toBe(true)
      expect(answers.language).toEqual('Arabic')
    })

    it('clears a previously saved language when an interpreter is not needed', async () => {
      await service.saveLanguage(order, { interpreterRequired: true, language: 'Arabic' })

      await service.saveLanguage(order, { interpreterRequired: false, language: 'Arabic' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.interpreterRequired).toBe(false)
      expect(answers.language).toEqual('')
    })

    it('keeps the answers from the other device wearer pages', async () => {
      await service.saveLanguage(order, { interpreterRequired: false, language: '' })

      const answers = await service.getDeviceWearer(order)
      expect(answers.firstName).toEqual(order.deviceWearer.firstName)
      expect(answers.disabilities).toEqual(order.deviceWearer.disabilities)
    })
  })

  describe('saveAdultAtInstallation', () => {
    it('saves the answer without changing the other answers', async () => {
      const order = orderFrom('YOUTH_COURT')

      await service.saveAdultAtInstallation(order, { adultAtTimeOfInstallation: true })

      const answers = await service.getDeviceWearer(order)
      expect(answers.adultAtTimeOfInstallation).toBe(true)
      expect(answers.firstName).toEqual('Jo')
    })
  })

  describe('submit', () => {
    const submittedAdultAtTimeOfInstallation = () =>
      (apiClient.put.mock.calls[0][0].data as { adultAtTimeOfInstallation: boolean | null }).adultAtTimeOfInstallation

    beforeEach(() => {
      apiClient.put.mockImplementation(async ({ data }) => ({
        ...createDeviceWearer(),
        ...(data as object),
        disabilities: 'VISION',
      }))
    })

    it.each<NotifyingOrganisation>(['YOUTH_CUSTODY_SERVICE', 'YOUTH_COURT', 'PRISON'])(
      'sends the answer to whether a responsible adult is required for %s orders',
      async notifyingOrganisation => {
        const order = orderFrom(notifyingOrganisation)

        await service.submit({ accessToken: 'token', order })

        expect(submittedAdultAtTimeOfInstallation()).toBe(false)
      },
    )

    it.each<NotifyingOrganisation>(['PROBATION', 'HOME_OFFICE', 'CROWN_COURT', 'FAMILY_COURT'])(
      'sends that no responsible adult is required for %s orders, even if one was required before',
      async notifyingOrganisation => {
        const order = orderFrom(notifyingOrganisation)

        await service.submit({ accessToken: 'token', order })

        expect(submittedAdultAtTimeOfInstallation()).toBe(true)
      },
    )

    it('overrides a stale cached Yes answer for other orders', async () => {
      const order = orderFrom('PROBATION')
      await service.saveAdultAtInstallation(order, { adultAtTimeOfInstallation: false })

      await service.submit({ accessToken: 'token', order })

      expect(submittedAdultAtTimeOfInstallation()).toBe(true)
    })

    it('sends a No answer unchanged for youth and prison orders', async () => {
      const order = orderFrom('YOUTH_CUSTODY_SERVICE')
      await service.saveAdultAtInstallation(order, { adultAtTimeOfInstallation: true })

      await service.submit({ accessToken: 'token', order })

      expect(submittedAdultAtTimeOfInstallation()).toBe(true)
    })

    it('sends that no responsible adult is required when the notifying organisation is not known', async () => {
      const order = { ...orderFrom('YOUTH_COURT'), interestedParties: null }

      await service.submit({ accessToken: 'token', order })

      expect(submittedAdultAtTimeOfInstallation()).toBe(true)
    })

    it('sends that no responsible adult is required when the question was never answered for other orders', async () => {
      const order = orderFrom('MAGISTRATES_COURT')
      order.deviceWearer.adultAtTimeOfInstallation = null

      await service.submit({ accessToken: 'token', order })

      expect(submittedAdultAtTimeOfInstallation()).toBe(true)
    })
  })
})
