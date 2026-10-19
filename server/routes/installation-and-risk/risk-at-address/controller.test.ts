import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import InMemoryStore from '../../store/inMemoryStore'
import { RiskAtInstallation } from '../riskAtInstallationModel'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskAtAddressController from './controller'

jest.mock('../riskAtInstallationService')

describe('RiskAtAddressController', () => {
  const answers: RiskAtInstallation = {
    possibleRisk: [],
    riskCategory: ['DANGEROUS_ANIMALS'],
    riskDetails: '',
    hasOtherRisks: null,
    genderRiskDetails: '',
  }
  let service: jest.Mocked<RiskAtInstallationService>
  let controller: RiskAtAddressController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    service = new RiskAtInstallationService(
      new RiskAtInstallationStoreService(new InMemoryStore()),
      {} as RestClient,
    ) as jest.Mocked<RiskAtInstallationService>
    service.getRiskAtInstallation.mockResolvedValue(answers)
    controller = new RiskAtAddressController(service)
    req = createMockRequest()
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
  })

  describe('view', () => {
    it('renders the saved answers', async () => {
      await controller.view(req, res, next)

      expect(service.getRiskAtInstallation).toHaveBeenCalledWith(req.order)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-at-address',
        expect.objectContaining({ riskCategory: expect.objectContaining({ values: ['DANGEROUS_ANIMALS'] }) }),
      )
    })

    it('renders the flashed validation errors', async () => {
      req.flash = jest.fn().mockReturnValue([{ field: 'riskCategory', error: 'Select something' }])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-at-address',
        expect.objectContaining({
          riskCategory: expect.objectContaining({ error: { text: 'Select something' } }),
        }),
      )
    })
  })

  describe('update', () => {
    it('saves the answers and goes to the other risks page', async () => {
      req.body = { action: 'continue', riskCategory: ['DANGEROUS_ANIMALS', 'IOM'] }

      await controller.update(req, res, next)

      expect(service.saveRiskAtAddress).toHaveBeenCalledWith(req.order, { riskCategory: ['DANGEROUS_ANIMALS', 'IOM'] })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', req.order!.id),
      )
    })

    it('returns to the page with the errors and saves nothing when the answers are invalid', async () => {
      req.body = { action: 'continue' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { field: 'riskCategory', error: 'Select all the possible risks at the installation address' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', req.order!.id),
      )
      expect(service.saveRiskAtAddress).not.toHaveBeenCalled()
    })
  })
})
