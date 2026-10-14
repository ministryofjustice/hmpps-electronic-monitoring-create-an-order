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
        genderRiskDetails: '',
      })
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
        genderRiskDetails: '',
      })
    })
  })

  describe('updateField', () => {
    it('keeps the updated answer in the cache over the saved order answers', async () => {
      order.detailsOfInstallation = { riskCategory: ['THREATS_OF_VIOLENCE'], riskDetails: '' }

      await service.updateField(order, 'possibleRisk', ['SEXUAL_OFFENCES'])

      expect((await service.getRiskAtInstallation(order)).possibleRisk).toEqual(['SEXUAL_OFFENCES'])
    })

    it('keeps the other cached answers', async () => {
      await service.updateField(order, 'possibleRisk', ['SEXUAL_OFFENCES'])
      await service.updateField(order, 'riskCategory', ['DANGEROUS_ANIMALS'])

      expect(await service.getRiskAtInstallation(order)).toEqual(
        expect.objectContaining({ possibleRisk: ['SEXUAL_OFFENCES'], riskCategory: ['DANGEROUS_ANIMALS'] }),
      )
    })

    it('caches answers per order version', async () => {
      await service.updateField(order, 'possibleRisk', ['SEXUAL_OFFENCES'])

      const otherVersion = { ...order, versionId: uuidv4(), detailsOfInstallation: null }

      expect((await service.getRiskAtInstallation(otherVersion)).possibleRisk).toEqual([])
    })
  })
})
