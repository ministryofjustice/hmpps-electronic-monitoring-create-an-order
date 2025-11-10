import { Request, Response, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import TypesOfMonitoringNeededController from './controller'
import { validationErrors } from '../../../constants/validationErrors'
import { ValidationResult } from '../../../models/Validation'

jest.mock('./viewModel')

describe('TypesOfMonitoringNeededController', () => {
  let controller: TypesOfMonitoringNeededController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()

    controller = new TypesOfMonitoringNeededController()

    mockConstructModel.mockReturnValue({
      items: [],
      addAnother: { value: '' },
      errorSummary: null,
    })

    req = createMockRequest()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/types-of-monitoring-needed',
        expect.anything(),
      )
    })

    it('constructs the model with the correct data', async () => {
      const errors = [{ text: 'An error', href: '#error' }] as unknown as ValidationResult
      ;(req.flash as jest.Mock).mockReturnValueOnce(errors)

      await controller.view(req, res, next)

      expect(mockConstructModel).toHaveBeenCalledWith(req.order, errors)
    })
  })

  describe('update', () => {
    it('redirects to the MONITORING_TYPE page when "Yes" is selected', async () => {
      req.body = { action: 'continue', addAnother: 'true' }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', req.order!.id),
      )
    })

    it('redirects to the MONITORING_TYPE page when "No" is selected', async () => {
      req.body = { action: 'continue', addAnother: 'false' }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPE.replace(':orderId', req.order!.id),
      )
    })

    it('validates and redirects if no option is selected', async () => {
      req.body = { action: 'continue', addAnother: null }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.monitoringConditions.addAnotherRequired,
          field: 'addAnother',
          focusTarget: 'addAnother',
        },
      ])

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED.replace(
          ':orderId',
          req.order!.id,
        ),
      )
    })
  })
})
