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
    it('offers each possible risk from the device wearer behaviour', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/WIP',
        expect.objectContaining({
          pageName: 'Risk behaviour',
          items: expect.arrayContaining([
            { value: 'THREATS_OF_VIOLENCE', text: 'Violent behaviour or threats of violence', checked: false },
          ]),
        }),
      )
    })

    it('checks the cached possible risk', async () => {
      await store.updateField(req.order!, 'possibleRisk', ['THREATS_OF_VIOLENCE'])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/WIP',
        expect.objectContaining({
          items: expect.arrayContaining([expect.objectContaining({ value: 'THREATS_OF_VIOLENCE', checked: true })]),
        }),
      )
    })
  })

  describe('update', () => {
    it('caches the selected possible risk', async () => {
      req.body = { action: 'continue', branch: 'SEXUAL_OFFENCES' }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).possibleRisk).toEqual(['SEXUAL_OFFENCES'])
    })

    it('goes to the risk at address page', async () => {
      req.body = { action: 'continue', branch: 'SEXUAL_OFFENCES' }

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', req.order!.id),
      )
    })
  })
})
