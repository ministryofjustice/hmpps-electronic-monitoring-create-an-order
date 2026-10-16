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
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
  })

  describe('view', () => {
    const template = 'pages/order/installation-and-risk/risk-at-address'

    it('renders the risk at address page with no risks checked by default', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(template, expect.objectContaining({ riskCategory: { values: [] } }))
    })

    it('checks the cached risks at the installation address', async () => {
      await store.updateField(req.order!, 'riskCategory', ['DANGEROUS_ANIMALS'])

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        template,
        expect.objectContaining({ riskCategory: { values: ['DANGEROUS_ANIMALS'] } }),
      )
    })
  })

  describe('view with errors', () => {
    it('renders the flashed validation error', async () => {
      const errors = [{ field: 'riskCategory', error: 'Select something' }]
      ;(req.flash as jest.Mock).mockImplementation((key: string) => (key === 'validationErrors' ? errors : []))

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/risk-at-address',
        expect.objectContaining({ riskCategory: { values: [], error: { text: 'Select something' } } }),
      )
    })
  })

  describe('update', () => {
    it('caches the selected risks at the installation address', async () => {
      req.body = { action: 'continue', riskCategory: ['DANGEROUS_ANIMALS', 'IOM'] }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).riskCategory).toEqual(['DANGEROUS_ANIMALS', 'IOM'])
    })

    it('caches a single selection sent as a string', async () => {
      req.body = { action: 'continue', riskCategory: 'IOM' }

      await controller.update(req, res, next)

      expect((await store.getRiskAtInstallation(req.order!)).riskCategory).toEqual(['IOM'])
    })

    describe('when no risks are selected', () => {
      beforeEach(async () => {
        await store.updateField(req.order!, 'riskCategory', ['IOM'])
        req.body = { action: 'continue' }

        await controller.update(req, res, next)
      })

      it('does not change the cached risks', async () => {
        expect((await store.getRiskAtInstallation(req.order!)).riskCategory).toEqual(['IOM'])
      })

      it('flashes a validation error', () => {
        expect(req.flash).toHaveBeenCalledWith('validationErrors', [
          { field: 'riskCategory', error: 'Select all the possible risks at the installation address' },
        ])
      })

      it('redirects back to the risk at address page', () => {
        expect(res.redirect).toHaveBeenCalledWith(
          paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS.replace(':orderId', req.order!.id),
        )
      })
    })

    it('goes to the other risks page', async () => {
      req.body = { action: 'continue', riskCategory: ['DANGEROUS_ANIMALS'] }

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', req.order!.id),
      )
    })
  })
})
