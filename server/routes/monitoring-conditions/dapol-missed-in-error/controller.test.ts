import { Response, Request, NextFunction } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import DapolMissedInErrorController from './controller'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../../store/inMemoryStore'
import constructModel from './viewModel'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import { getMockOrder } from '../../../../test/mocks/mockOrder'

jest.mock('../monitoringConditionsStoreService')
jest.mock('./viewModel')

describe('dapol missed in error controller', () => {
  let mockDataStore: InMemoryStore
  let mockStore: jest.Mocked<MonitoringConditionsStoreService>
  let controller: DapolMissedInErrorController
  let res: Response
  let req: Request
  let next: NextFunction
  const mockConstructModel = jest.mocked(constructModel)

  beforeEach(() => {
    jest.restoreAllMocks()
    mockDataStore = new InMemoryStore()
    mockStore = new MonitoringConditionsStoreService(mockDataStore) as jest.Mocked<MonitoringConditionsStoreService>
    mockStore.getMonitoringConditions.mockResolvedValue({})

    controller = new DapolMissedInErrorController(mockStore)

    mockConstructModel.mockReturnValue({ errorSummary: null, dapolMissedInError: { value: '' } })

    req = createMockRequest()
    req.order = getMockOrder()
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('renders the correct view', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/dapol-missed-in-error',
        expect.anything(),
      )
    })

    it('render with the model', async () => {
      mockStore.getMonitoringConditions.mockResolvedValue({ dapolMissedInError: 'YES' })
      mockConstructModel.mockReturnValueOnce({ errorSummary: null, dapolMissedInError: { value: 'YES' } })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        errorSummary: null,
        dapolMissedInError: { value: 'YES' },
      })
    })
  })

  describe('update', () => {
    it('redirects to the next page', async () => {
      req.body = {
        action: 'continue',
        dapolMissedInError: 'YES',
      }
      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', req.order!.id),
      )
    })

    it('validates', async () => {
      req.body = {
        action: 'continue',
      }
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.monitoringConditions.dapolMissedRequired,
          field: 'dapolMissedInError',
          focusTarget: 'dapolMissedInError',
        },
      ])
    })

    it('updates store', async () => {
      req.body = {
        action: 'continue',
        dapolMissedInError: 'YES',
      }
      await controller.update(req, res, next)

      expect(mockStore.updateField).toHaveBeenCalledWith(req.order!, 'dapolMissedInError', 'YES')
    })
  })
})
