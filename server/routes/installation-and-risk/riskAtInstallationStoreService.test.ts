import { v4 as uuidv4 } from 'uuid'
import RiskAtInstallationStoreService from './riskAtInstallationStoreService'
import InMemoryStore from '../store/inMemoryStore'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { Order } from '../../models/Order'

describe('RiskAtInstallationStoreService', () => {
  let service: RiskAtInstallationStoreService
  let order: Order

  beforeEach(() => {
    service = new RiskAtInstallationStoreService(new InMemoryStore())
    order = getMockOrder({ id: uuidv4() })
  })

  describe('getRiskAtInstallation', () => {
    it('starts with empty answers when the order has no details of installation', async () => {
      order.detailsOfInstallation = null

      expect(await service.getRiskAtInstallation(order)).toEqual({
        possibleRisk: [],
        riskCategory: [],
        riskDetails: '',
        hasOtherRisks: null,
        genderRiskDetails: '',
      })
    })

    it('answers yes to other risks when details were saved', async () => {
      order.dataDictionaryVersion = 'DDV6'
      order.detailsOfInstallation = { riskCategory: [], riskDetails: 'some details' }

      expect((await service.getRiskAtInstallation(order)).hasOtherRisks).toBe('YES')
    })

    it('answers no to other risks when saved details are empty', async () => {
      order.dataDictionaryVersion = 'DDV6'
      order.detailsOfInstallation = { riskCategory: [], riskDetails: '' }

      expect((await service.getRiskAtInstallation(order)).hasOtherRisks).toBe('NO')
    })

    it('leaves other risks unanswered when no risks were saved', async () => {
      order.dataDictionaryVersion = 'DDV6'
      order.detailsOfInstallation = { riskCategory: null, riskDetails: null }

      expect((await service.getRiskAtInstallation(order)).hasOtherRisks).toBeNull()
    })

    it('splits the saved risk categories into behaviour and address risks', async () => {
      order.dataDictionaryVersion = 'DDV6'
      order.detailsOfInstallation = {
        riskCategory: ['RISK_TO_GENDER', 'THREATS_OF_VIOLENCE', 'DANGEROUS_ANIMALS'],
        genderRiskDetails: 'Women',
        riskDetails: 'some details',
      }

      expect(await service.getRiskAtInstallation(order)).toEqual({
        possibleRisk: ['RISK_TO_GENDER', 'THREATS_OF_VIOLENCE'],
        riskCategory: ['DANGEROUS_ANIMALS'],
        riskDetails: 'some details',
        hasOtherRisks: 'YES',
        genderRiskDetails: 'Women',
      })
    })
  })

  describe('getRiskAtInstallation for pre-DDV6 orders', () => {
    it('seeds the answers from the legacy installation and risk data', async () => {
      const legacyOrder = getMockOrder({
        id: uuidv4(),
        dataDictionaryVersion: 'DDV5',
        installationAndRisk: {
          offence: null,
          offences: null,
          offenceAdditionalDetails: null,
          mappaLevel: null,
          mappaCaseType: null,
          riskCategory: ['THREATS_OF_VIOLENCE', 'DANGEROUS_ANIMALS'],
          riskDetails: 'legacy details',
        },
        detailsOfInstallation: null,
      })

      expect(await service.getRiskAtInstallation(legacyOrder)).toEqual({
        possibleRisk: ['THREATS_OF_VIOLENCE'],
        riskCategory: ['DANGEROUS_ANIMALS'],
        riskDetails: 'legacy details',
        hasOtherRisks: 'YES',
        genderRiskDetails: '',
      })
    })
  })

  describe('writes', () => {
    it('does not write to the store when reading', async () => {
      const store = new InMemoryStore()
      const setSpy = jest.spyOn(store, 'set')

      await new RiskAtInstallationStoreService(store).getRiskAtInstallation(order)

      expect(setSpy).not.toHaveBeenCalled()
    })

    it('writes once when answers are updated', async () => {
      const store = new InMemoryStore()
      const setSpy = jest.spyOn(store, 'set')

      await new RiskAtInstallationStoreService(store).update(order, {
        possibleRisk: ['RISK_TO_GENDER'],
        genderRiskDetails: 'Women',
      })

      expect(setSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    it('keeps the updated answer in the cache over the saved order answers', async () => {
      order.detailsOfInstallation = { riskCategory: ['THREATS_OF_VIOLENCE'], riskDetails: '' }

      await service.update(order, { possibleRisk: ['SEXUAL_OFFENCES'] })

      expect((await service.getRiskAtInstallation(order)).possibleRisk).toEqual(['SEXUAL_OFFENCES'])
    })

    it('keeps the other cached answers', async () => {
      await service.update(order, { possibleRisk: ['SEXUAL_OFFENCES'] })
      await service.update(order, { riskCategory: ['DANGEROUS_ANIMALS'] })

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ possibleRisk: ['SEXUAL_OFFENCES'], riskCategory: ['DANGEROUS_ANIMALS'] }),
      )
    })

    it('caches answers per order version', async () => {
      await service.update(order, { possibleRisk: ['SEXUAL_OFFENCES'] })

      const otherVersion = { ...order, versionId: uuidv4(), detailsOfInstallation: null }

      expect((await service.getRiskAtInstallation(otherVersion)).possibleRisk).toEqual([])
    })
  })
})
