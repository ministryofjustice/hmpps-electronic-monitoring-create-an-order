import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import InMemoryStore from '../../store/inMemoryStore'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskBehaviourController from './controller'

describe('RiskBehaviourController', () => {
  let store: RiskAtInstallationStoreService
  let controller: RiskBehaviourController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    store = new RiskAtInstallationStoreService(new InMemoryStore())
    controller = new RiskBehaviourController(store)
    req = createMockRequest()
    res = createMockResponse()
  })

  describe('view', () => {
    it('renders the risk behaviour page with no risks checked by default', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-behaviour',
        expect.objectContaining({ possibleRisk: { values: [] } }),
      )
    })

    it('checks the cached possible risks', async () => {
      await store.updateField(req.order!, 'possibleRisk', ['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-behaviour',
        expect.objectContaining({ possibleRisk: { values: ['THREATS_OF_VIOLENCE', 'SEXUAL_OFFENCES'] } }),
      )
    })
  })

  describe('update', () => {
    it('caches every selected possible risk', async () => {
      req.body = { action: 'continue', possibleRisk: ['SEXUAL_OFFENCES', 'THREATS_OF_VIOLENCE'] }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).possibleRisk).toEqual([
        'SEXUAL_OFFENCES',
        'THREATS_OF_VIOLENCE',
      ])
    })

    it('caches a single selected possible risk', async () => {
      req.body = { action: 'continue', possibleRisk: 'SEXUAL_OFFENCES' }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).possibleRisk).toEqual(['SEXUAL_OFFENCES'])
    })

    it('goes to the risk at address page', async () => {
      req.body = { action: 'continue', possibleRisk: ['SEXUAL_OFFENCES'] }

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', req.order!.id),
      )
    })
  })
})
