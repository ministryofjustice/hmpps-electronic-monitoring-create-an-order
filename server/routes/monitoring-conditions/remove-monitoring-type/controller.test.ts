import { Request, Response } from 'express'
import RemoveMonitoringTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import RestClient from '../../../data/restClient'
import RemoveMonitoringTypeService from './service'

jest.mock('../../../data/restClient')
jest.mock('./service')

describe('remove monitoring type controller', () => {
  let req: Request
  let res: Response
  let mockRestClient: RestClient
  let mockService: RemoveMonitoringTypeService
  let controller: RemoveMonitoringTypeController
  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockService = new RemoveMonitoringTypeService(mockRestClient) as jest.Mocked<RemoveMonitoringTypeService>
    mockService.removeMonitoringType = jest.fn()
    mockService.shouldRemoveTagAtSource = jest.fn()

    controller = new RemoveMonitoringTypeController(mockService)

    req = createMockRequest()
    res = createMockResponse()
    res.status = jest.fn(() => res)

    req.order!.curfewConditions = {
      startDate: '2024-11-11T00:00:00Z',
      endDate: '2024-11-11T00:00:00Z',
      curfewAddress: null,
      curfewAdditionalDetails: null,
      id: 'some id',
    }
    req.params = {
      monitoringTypeId: 'some id',
    }
  })
  describe('view', () => {
    it('renders the correct page', async () => {
      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/remove-monitoring-type',
        expect.anything(),
      )
    })

    it('constructs the correct model', async () => {
      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        monitoringTypeReadable: 'Curfew from 11/11/2024 to 11/11/2024',
      })
    })

    it('returns a bad request if monitoring types id doesnt match', async () => {
      req.params = {
        monitoringTypeId: 'some other id',
      }

      await controller.view(req, res, jest.fn())

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith('No matching monitoring type: some other id')
    })
  })

  describe('update', () => {
    it('calls the service to remove', async () => {
      req.body = {
        action: 'continue',
      }
      req.params = {
        monitoringTypeId: 'some other id',
      }

      await controller.update(req, res, jest.fn())

      expect(mockService.removeMonitoringType).toHaveBeenCalledWith({
        orderId: req.order!.id,
        monitoringTypeId: 'some other id',
        accessToken: 'fakeUserToken',
      })
    })
  })
})
