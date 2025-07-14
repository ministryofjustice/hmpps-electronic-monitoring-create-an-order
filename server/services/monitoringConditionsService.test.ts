import RestClient from '../data/restClient'
import { MonitoringConditionsFormData } from '../models/form-data/monitoringConditions'
import MonitoringConditionsService, { UpdateMonitoringConditionsInput } from './monitoringConditionsService'

jest.mock('../data/restClient')

const mockApiResponse = {
  alcohol: false,
  conditionType: 'condition',
  curfew: false,
  endDate: '2005-03-31T23:00:00.000Z',
  exclusionZone: false,
  hdc: 'YES',
  issp: 'YES',
  mandatoryAttendance: false,
  orderType: 'CIVIL',
  orderTypeDescription: 'some pilot',
  prarr: 'YES',
  sentenceType: 'LIFE_SENTENCE',
  startDate: '2005-03-31T23:00:00.000Z',
  trail: false,
  pilot: 'some pilot',
  isValid: true,
}

const createInput = (overrideData: Partial<MonitoringConditionsFormData> = {}): UpdateMonitoringConditionsInput => {
  return {
    accessToken: 'mockToken',
    orderId: 'mockId',
    data: {
      orderType: 'CIVIL',
      monitoringRequired: ['someMonitoring'],
      orderTypeDescription: 'some pilot',
      conditionType: 'condition',
      startDate: { day: '01', month: '4', year: '2005', hours: '00', minutes: '00' },
      endDate: { day: '01', month: '4', year: '2005', hours: '00', minutes: '00' },
      sentenceType: 'LIFE_SENTENCE',
      issp: 'YES',
      hdc: 'YES',
      prarr: 'YES',
      pilot: 'some pilot',
      ...overrideData,
    },
  }
}

describe('Monitoring conditions service', () => {
  let mockRestClient: jest.Mocked<RestClient>

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
  })

  describe('updateMonitoringConditions', () => {
    it('should parse and send valid monitoring conditions to the API', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const monitoringConditionsService = new MonitoringConditionsService(mockRestClient)
      const updateMonitoringConditionsInput: UpdateMonitoringConditionsInput = createInput()

      const result = await monitoringConditionsService.updateMonitoringConditions(updateMonitoringConditionsInput)

      expect(mockRestClient.put).toHaveBeenCalled()
      expect(mockRestClient.put).toHaveBeenCalledWith({
        data: {
          alcohol: false,
          conditionType: 'condition',
          curfew: false,
          endDate: '2005-03-31T23:00:00.000Z',
          exclusionZone: false,
          hdc: 'YES',
          issp: 'YES',
          mandatoryAttendance: false,
          orderType: 'CIVIL',
          orderTypeDescription: 'some pilot',
          prarr: 'YES',
          sentenceType: 'LIFE_SENTENCE',
          startDate: '2005-03-31T23:00:00.000Z',
          trail: false,
          pilot: 'some pilot',
        },
        path: '/api/orders/mockId/monitoring-conditions',
        token: 'mockToken',
      })

      expect(result).toEqual(mockApiResponse)
    })

    it('does not error if pilot is empty', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const monitoringConditionsService = new MonitoringConditionsService(mockRestClient)
      const updateMonitoringConditionsInput: UpdateMonitoringConditionsInput = createInput({ pilot: '' })

      const result = await monitoringConditionsService.updateMonitoringConditions(updateMonitoringConditionsInput)

      expect(result).toEqual(mockApiResponse)
    })

    it('does error if orderTypeDescription is empty and order is ddv4', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const monitoringConditionsService = new MonitoringConditionsService(mockRestClient)
      const updateMonitoringConditionsInput: UpdateMonitoringConditionsInput = createInput({
        orderTypeDescription: '',
        dataDictionaryVersion: 'DDV4',
      })

      const result = await monitoringConditionsService.updateMonitoringConditions(updateMonitoringConditionsInput)

      expect(result).toEqual([
        { error: 'Select the type of pilot the device wearer is part of', field: 'orderTypeDescription' },
      ])
    })

    it('does not error if orderTypeDescription is empty and order is ddv5', async () => {
      mockRestClient.put.mockResolvedValue(mockApiResponse)
      const monitoringConditionsService = new MonitoringConditionsService(mockRestClient)
      const updateMonitoringConditionsInput: UpdateMonitoringConditionsInput = createInput({
        orderTypeDescription: '',
        dataDictionaryVersion: 'DDV5',
      })

      const result = await monitoringConditionsService.updateMonitoringConditions(updateMonitoringConditionsInput)

      expect(result).toEqual(mockApiResponse)
    })
  })
})
