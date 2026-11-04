import { v4 as uuidv4 } from 'uuid'
import RestClient from '../../data/restClient'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { Order } from '../../models/Order'
import { SanitisedError } from '../../sanitisedError'
import InMemoryStore from '../store/inMemoryStore'
import RiskAtInstallationService from './riskAtInstallationService'
import RiskAtInstallationStoreService from './riskAtInstallationStoreService'

jest.mock('../../data/restClient')

describe('RiskAtInstallationService', () => {
  let apiClient: jest.Mocked<RestClient>
  let service: RiskAtInstallationService
  let order: Order

  beforeEach(() => {
    apiClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    service = new RiskAtInstallationService(new RiskAtInstallationStoreService(new InMemoryStore()), apiClient)
    order = getMockOrder({ id: uuidv4(), detailsOfInstallation: null })
  })

  describe('saveRiskBehaviour', () => {
    it('keeps the gender risk details when risk to gender is selected', async () => {
      await service.saveRiskBehaviour(order, { possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'Women' })

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'Women' }),
      )
    })

    it('discards the gender risk details when risk to gender is not selected', async () => {
      await service.saveRiskBehaviour(order, { possibleRisk: ['SEXUAL_OFFENCES'], genderRiskDetails: 'Women' })

      expect((await service.getRiskAtInstallation(order)).genderRiskDetails).toBe('')
    })
  })

  describe('saveRiskAtAddress', () => {
    it('keeps the earlier answers', async () => {
      await service.saveRiskBehaviour(order, { possibleRisk: ['SEXUAL_OFFENCES'], genderRiskDetails: '' })

      await service.saveRiskAtAddress(order, { riskCategory: ['DANGEROUS_ANIMALS'] })

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ possibleRisk: ['SEXUAL_OFFENCES'], riskCategory: ['DANGEROUS_ANIMALS'] }),
      )
    })
  })

  describe('saveOtherRisks', () => {
    it('keeps the details when there are other risks', async () => {
      await service.saveOtherRisks(order, { hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' })

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' }),
      )
    })

    it('discards the details when there are no other risks', async () => {
      await service.saveOtherRisks(order, { hasOtherRisks: 'NO', riskDetails: 'left over text' })

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ hasOtherRisks: 'NO', riskDetails: '' }),
      )
    })
  })

  describe('submit', () => {
    it('sends all the answers as details of installation', async () => {
      apiClient.put.mockResolvedValue({ riskCategory: [], riskDetails: '', genderRiskDetails: '' })
      await service.saveRiskBehaviour(order, { possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'Women' })
      await service.saveRiskAtAddress(order, { riskCategory: ['DANGEROUS_ANIMALS'] })
      await service.saveOtherRisks(order, { hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' })

      await service.submit({ accessToken: 'token', order })

      expect(apiClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${order.id}/details-of-installation`,
        data: {
          riskCategory: ['RISK_TO_GENDER', 'DANGEROUS_ANIMALS'],
          riskDetails: 'Aggressive neighbour',
          genderRiskDetails: 'Women',
        },
        token: 'token',
      })
    })

    it('returns the saved details of installation', async () => {
      const saved = { riskCategory: ['DANGEROUS_ANIMALS'], riskDetails: '', genderRiskDetails: '' }
      apiClient.put.mockResolvedValue(saved)

      expect(await service.submit({ accessToken: 'token', order })).toEqual(saved)
    })

    it('returns the validation errors when the api rejects the answers', async () => {
      const error = {
        status: 400,
        data: [{ field: 'riskCategory', error: 'Risk category is invalid' }],
      } as unknown as SanitisedError
      apiClient.put.mockRejectedValue(error)

      expect(await service.submit({ accessToken: 'token', order })).toEqual([
        { field: 'riskCategory', error: 'Risk category is invalid' },
      ])
    })

    it('rethrows other api errors', async () => {
      apiClient.put.mockRejectedValue({ status: 500 })

      await expect(service.submit({ accessToken: 'token', order })).rejects.toEqual({ status: 500 })
    })
  })
})
