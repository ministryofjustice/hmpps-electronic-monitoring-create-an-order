import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import VariationService from '../../services/variationService'
import VariationDetailsController from './variationDetailsController'
import paths from '../../constants/paths'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../test/mocks/mockOrder'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/taskListService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('VariationDetailsController', () => {
  let taskListService: jest.Mocked<TaskListService>
  let auditClient: jest.Mocked<HmppsAuditClient>
  let auditService: jest.Mocked<AuditService>
  let restClient: jest.Mocked<RestClient>
  let variationService: VariationService
  let controller: VariationDetailsController

  beforeEach(() => {
    auditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    restClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    auditService = new AuditService(auditClient) as jest.Mocked<AuditService>
    variationService = new VariationService(restClient)
    taskListService = new TaskListService() as jest.Mocked<TaskListService>
    controller = new VariationDetailsController(auditService, variationService, taskListService)
  })

  describe('view', () => {
    it('should render the variation details view for a new variation', async () => {
      // Given
      const req = createMockRequest({
        order: getMockOrder({ type: 'VARIATION' }),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/variation/variation-details', {
        errorSummary: null,
        variationDate: {
          value: {
            day: '',
            month: '',
            year: '',
            minutes: '',
            hours: '',
          },
        },
        variationType: {
          value: 'ADDRESS',
        },
        variationDetails: {
          value: '',
        },
      })
    })

    it('should render the variation details view for an existing variation', async () => {
      // Given
      const req = createMockRequest({
        order: getMockOrder({
          type: 'VARIATION',
          variationDetails: {
            variationType: 'CURFEW_HOURS',
            variationDate: '2024-01-01T00:00:00.000Z',
            variationDetails: 'Change to curfew hours',
          },
        }),
        flash: jest.fn().mockReturnValue([]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/variation/variation-details', {
        variationType: {
          value: 'ADDRESS',
        },
        variationDate: {
          value: {
            year: '2024',
            month: '01',
            day: '01',
            minutes: '00',
            hours: '00',
          },
        },
        variationDetails: {
          value: 'Change to curfew hours',
        },
        errorSummary: null,
      })
    })

    it('should render the variation details view with errors', async () => {
      // Given
      const req = createMockRequest({
        order: getMockOrder({
          type: 'VARIATION',
        }),
        flash: jest
          .fn()
          .mockReturnValueOnce([
            { error: 'Select what you have changed', field: 'variationType' },
            { error: 'Enter the date you want the changes to take effect', field: 'variationDate' },
            { error: 'Enter information on what you have changed', field: 'variationDetails' },
          ])
          .mockReturnValueOnce([
            {
              variationType: '',
              variationDate: {
                year: '',
                month: '',
                day: '',
              },
              variationDetails: '',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/variation/variation-details', {
        variationType: {
          value: '',
          error: {
            text: 'Select what you have changed',
          },
        },
        variationDate: {
          value: {
            year: '',
            month: '',
            day: '',
          },
          error: {
            text: 'Enter the date you want the changes to take effect',
          },
        },
        variationDetails: {
          value: '',
          error: {
            text: 'Enter information on what you have changed',
          },
        },
        errorSummary: {
          titleText: 'There is a problem',
          errorList: [
            { href: '#variationType', text: 'Select what you have changed' },
            { href: '#variationDate', text: 'Enter the date you want the changes to take effect' },
            { href: '#variationDetails', text: 'Enter information on what you have changed' },
          ],
        },
      })
    })
  })

  describe('update', () => {
    it('should send a valid payload to the api when the user submits valid data', async () => {
      // Given
      const order = getMockOrder({ type: 'VARIATION' })
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          variationType: 'CURFEW_HOURS',
          variationDate: {
            year: '2024',
            month: '01',
            day: '01',
          },
          variationDetails: 'Change to curfew hours',
        },
        params: {
          orderId: order.id,
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()
      restClient.put.mockResolvedValue({
        variationType: 'CURFEW_HOURS',
        variationDate: '2024-01-01T00:00:00.000Z',
        variationDetails: 'Change to curfew hours',
      })

      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(taskListService.getNextPage).toHaveBeenCalledWith('VARIATION_DETAILS', order)
      expect(res.redirect).toHaveBeenCalled()
      expect(restClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${order.id}/variation`,
        data: {
          variationType: 'CURFEW_HOURS',
          variationDate: '2024-01-01T00:00:00.000Z',
          variationDetails: 'Change to curfew hours',
        },
        token: 'fakeUserToken',
      })
    })

    it('should generate errors when the user submits invalid data', async () => {
      // Given
      const order = getMockOrder({ type: 'VARIATION' })
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          variationType: '',
          variationDate: {
            year: '',
            month: '',
            day: '',
          },
          variationDetails: '',
        },
        params: {
          orderId: order.id,
        },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', {
        variationType: '',
        variationDate: {
          year: '',
          month: '',
          day: '',
        },
        variationDetails: '',
      })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        { error: 'Enter the date you want the changes to take effect', field: 'variationDate' },
        { error: 'Select what you have changed', field: 'variationType' },
        { error: 'Enter information on what you have changed', field: 'variationDetails' },
      ])
      expect(taskListService.getNextPage).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(paths.VARIATION.VARIATION_DETAILS.replace(':orderId', order.id))
      expect(restClient.put).not.toHaveBeenCalled()
    })
  })
})
