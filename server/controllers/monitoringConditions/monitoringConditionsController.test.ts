import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsService from '../../services/monitoringConditionsService'
import TaskListService from '../../services/taskListService'
import MonitoringConditionsController from './monitoringConditionsController'
import RestClient from '../../data/restClient'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import config from '../../config'

jest.mock('../../services/monitoringConditionsService')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe(MonitoringConditionsController, () => {
  let mockMonitoringConditionsService: jest.Mocked<MonitoringConditionsService>
  const taskListService = new TaskListService()
  let controller: MonitoringConditionsController
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockMonitoringConditionsService = new MonitoringConditionsService(
      mockRestClient,
    ) as jest.Mocked<MonitoringConditionsService>
    controller = new MonitoringConditionsController(mockMonitoringConditionsService, taskListService)
  })

  describe('view monitoring conditions', () => {
    it('should show which monitoring requirements have been selected', async () => {
      const mockOrder = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
          curfew: true,
          exclusionZone: true,
          trail: true,
          alcohol: true,
        }),
      })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/index',
        expect.objectContaining({
          monitoringRequired: {
            values: ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol'],
          },
        }),
      )
    })
  })

  describe('update monitoring conditions', () => {
    it('should default start time and end time when feature flag is turned off', async () => {
      const mockOrder = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
          curfew: true,
          exclusionZone: true,
          trail: true,
          alcohol: true,
        }),
      })

      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      req.params.orderId = mockId
      req.body = {
        startDate: {
          day: '11',
          month: '05',
          year: '2025',
          hours: '00',
          minutes: '00',
        },
        endDate: {
          day: '11',
          month: '06',
          year: '2025',
          hours: '23',
          minutes: '59',
        },
      }
      const res = createMockResponse()
      const next = jest.fn()
      config.monitoringConditionTimes.enabled = false
      mockMonitoringConditionsService.updateMonitoringConditions = jest.fn().mockResolvedValue({ isValid: true })
      await controller.update(req, res, next)

      expect(mockMonitoringConditionsService.updateMonitoringConditions).toHaveBeenCalledWith({
        accessToken: res.locals.user.token,
        orderId: mockId,
        data: {
          action: 'continue',
          orderType: 'undefined',
          monitoringRequired: [],
          orderTypeDescription: 'undefined',
          conditionType: '',
          startDate: { day: '11', month: '05', year: '2025', hours: '00', minutes: '00' },
          endDate: { day: '11', month: '06', year: '2025', hours: '23', minutes: '59' },
          sentenceType: null,
          issp: 'UNKNOWN',
          hdc: 'UNKNOWN',
          prarr: 'UNKNOWN',
          pilot: 'undefined',
        },
      })
    })

    it('should use actual start time and end time when feature flag is turned on', async () => {
      const mockOrder = getMockOrder({
        id: mockId,
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
          curfew: true,
          exclusionZone: true,
          trail: true,
          alcohol: true,
        }),
      })

      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      req.params.orderId = mockId
      req.body = {
        startDate: {
          day: '11',
          month: '05',
          year: '2025',
          hours: '00',
          minutes: '00',
        },
        endDate: {
          day: '11',
          month: '06',
          year: '2025',
          hours: '23',
          minutes: '59',
        },
      }
      const res = createMockResponse()
      const next = jest.fn()
      config.monitoringConditionTimes.enabled = true
      mockMonitoringConditionsService.updateMonitoringConditions = jest.fn().mockResolvedValue({ isValid: true })
      await controller.update(req, res, next)

      expect(mockMonitoringConditionsService.updateMonitoringConditions).toHaveBeenCalledWith({
        accessToken: res.locals.user.token,
        orderId: mockId,
        data: {
          action: 'continue',
          orderType: 'undefined',
          monitoringRequired: [],
          orderTypeDescription: 'undefined',
          conditionType: '',
          startDate: { day: '11', month: '05', year: '2025', hours: '00', minutes: '00' },
          endDate: { day: '11', month: '06', year: '2025', hours: '23', minutes: '59' },
          sentenceType: null,
          issp: 'UNKNOWN',
          hdc: 'UNKNOWN',
          prarr: 'UNKNOWN',
          pilot: 'undefined',
        },
      })
    })
  })
})
