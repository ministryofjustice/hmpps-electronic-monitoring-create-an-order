import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import InMemoryStore from '../../store/inMemoryStore'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import RiskAtAddressController from './controller'

describe('RiskAtAddressController', () => {
  let store: RiskAtInstallationStoreService
  let controller: RiskAtAddressController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    store = new RiskAtInstallationStoreService(new InMemoryStore())
    controller = new RiskAtAddressController(store)
    req = createMockRequest()
    res = createMockResponse()
  })

  describe('view', () => {
    it('offers each possible risk at the installation address', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/WIP',
        expect.objectContaining({
          pageName: 'Risk at address',
          items: expect.arrayContaining([
            { value: 'DANGEROUS_ANIMALS', text: 'Animals at the property, for example dogs', checked: false },
          ]),
        }),
      )
    })

    it('checks the cached risk at the installation address', async () => {
      await store.updateField(req.order!, 'riskCategory', ['DANGEROUS_ANIMALS'])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/WIP',
        expect.objectContaining({
          items: expect.arrayContaining([expect.objectContaining({ value: 'DANGEROUS_ANIMALS', checked: true })]),
        }),
      )
    })
  })

  describe('update', () => {
    it('caches the selected risk at the installation address', async () => {
      req.body = { action: 'continue', branch: 'DANGEROUS_ANIMALS' }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).riskCategory).toEqual(['DANGEROUS_ANIMALS'])
    })

    it('goes to the other risks page', async () => {
      req.body = { action: 'continue', branch: 'DANGEROUS_ANIMALS' }

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', req.order!.id),
      )
    })
  })
})
