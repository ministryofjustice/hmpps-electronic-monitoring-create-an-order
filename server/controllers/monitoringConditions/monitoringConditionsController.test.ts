import { v4 as uuidv4 } from 'uuid'
import MonitoringConditionsService from '../../services/monitoringConditionsService'
import TaskListService from '../../services/taskListService'
import MonitoringConditionsController from './monitoringConditionsController'
import RestClient from '../../data/restClient'
import { createMonitoringConditions, getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'

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
})
