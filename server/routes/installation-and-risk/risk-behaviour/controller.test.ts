import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import InMemoryStore from '../../store/inMemoryStore'
import { RiskAtInstallation } from '../riskAtInstallationModel'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskBehaviourController from './controller'

jest.mock('../riskAtInstallationService')

describe('RiskBehaviourController', () => {
  const answers: RiskAtInstallation = {
    possibleRisk: ['RISK_TO_GENDER'],
    riskCategory: [],
    riskDetails: '',
    hasOtherRisks: null,
    genderRiskDetails: 'Women',
  }
  let service: jest.Mocked<RiskAtInstallationService>
  let controller: RiskBehaviourController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    service = new RiskAtInstallationService(
      new RiskAtInstallationStoreService(new InMemoryStore()),
      {} as RestClient,
    ) as jest.Mocked<RiskAtInstallationService>
    service.getRiskAtInstallation.mockResolvedValue(answers)
    controller = new RiskBehaviourController(service)
    req = createMockRequest()
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
  })

  describe('view', () => {
    it('renders the saved answers', async () => {
      await controller.view(req, res, next)

      expect(service.getRiskAtInstallation).toHaveBeenCalledWith(req.order)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-behaviour',
        expect.objectContaining({
          possibleRisk: expect.objectContaining({ values: ['RISK_TO_GENDER'] }),
          genderRiskDetails: expect.objectContaining({ value: 'Women' }),
        }),
      )
    })

    it('renders the rejected answers instead of the saved answers', async () => {
      const rejected = { action: 'continue', possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'a'.repeat(101) }
      req.flash = jest.fn().mockImplementation((key: string) => (key === 'formData' ? [rejected] : []))

      await controller.view(req, res, next)

      expect(service.getRiskAtInstallation).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-behaviour',
        expect.objectContaining({
          possibleRisk: expect.objectContaining({ values: ['RISK_TO_GENDER'] }),
          genderRiskDetails: expect.objectContaining({ value: 'a'.repeat(101) }),
        }),
      )
    })

    it('renders the flashed validation errors', async () => {
      req.flash = jest
        .fn()
        .mockImplementation((key: string) =>
          key === 'validationErrors' ? [{ field: 'possibleRisk', error: 'Select something' }] : [],
        )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-behaviour',
        expect.objectContaining({
          possibleRisk: expect.objectContaining({ error: { text: 'Select something' } }),
        }),
      )
    })
  })

  describe('update', () => {
    it('saves the answers and goes to the risk at address page', async () => {
      req.body = { action: 'continue', possibleRisk: ['RISK_TO_GENDER'], genderRiskDetails: 'Women' }

      await controller.update(req, res, next)

      expect(service.saveRiskBehaviour).toHaveBeenCalledWith(req.order, {
        possibleRisk: ['RISK_TO_GENDER'],
        genderRiskDetails: 'Women',
      })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', req.order!.id),
      )
    })

    it('returns to the page with the errors and saves nothing when the answers are invalid', async () => {
      req.body = { action: 'continue', possibleRisk: 'RISK_TO_GENDER' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('formData', {
        action: 'continue',
        possibleRisk: ['RISK_TO_GENDER'],
        genderRiskDetails: '',
      })
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { field: 'genderRiskDetails', error: 'Enter what sex or gender they are a risk to' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR.replace(':orderId', req.order!.id),
      )
      expect(service.saveRiskBehaviour).not.toHaveBeenCalled()
    })
  })
})
