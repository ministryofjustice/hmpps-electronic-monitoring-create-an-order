import type { NextFunction, Request, Response } from 'express'
import SentenceTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { MonitoringConditions } from '../model'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import paths from '../../../constants/paths'
import { validationErrors } from '../../../constants/validationErrors'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'

jest.mock('../monitoringConditionsStoreService')

describe('SentenceTypeController', () => {
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    const mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>

    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({} as MonitoringConditions)

    mockOrder = getMockOrder()

    req = createMockRequest()
    req.order = mockOrder
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('should construct the correct model when the order type is POST_RELEASE', async () => {
      const mockData: Partial<MonitoringConditions> = { orderType: 'POST_RELEASE' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(mockData as MonitoringConditions)

      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      const expectedModel = {
        sentenceTypeQuestions: [
          { question: 'Standard Determinate Sentence', value: 'Standard Determinate Sentence' },
          { question: 'Detention and Training Order', value: 'Detention and Training Order (DTO)' },
          { question: 'Section 250 / Section 91', value: 'Section 250 / Section 91' },
        ],
        sentenceType: { value: '' },
        errorSummary: null,
      }
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/sentence-type/sentence-type',
        expect.objectContaining(expectedModel),
      )
    })

    it('should construct the correct model with no questions when there is no data in the store', async () => {
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sentenceTypeQuestions: [],
          sentenceType: { value: '' },
          errorSummary: null,
        }),
      )
    })
  })

  describe('update', () => {
    it('should redirect back to the view with errors when no sentence type is selected', async () => {
      req.body = { action: 'continue' }
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', mockOrder.id),
      )
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.monitoringConditions.sentenceTypeRequired,
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
    })

    it("should save the data and redirect to the HDC page when 'Standard Determinate Sentence' is selected", async () => {
      req.body = { action: 'continue', sentenceType: 'Standard Determinate Sentence' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'POST_RELEASE',
      } as MonitoringConditions)
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, req.body)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', mockOrder.id),
      )
    })

    it("should save the data and redirect to the ISS page when 'Detention and Training Order' is selected", async () => {
      req.body = { action: 'continue', sentenceType: 'Detention and Training Order (DTO)' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'POST_RELEASE',
      } as MonitoringConditions)
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, req.body)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ISS.replace(':orderId', mockOrder.id),
      )
    })

    it('should save the data and redirect to the PRARR page for any other POST_RELEASE option', async () => {
      req.body = { action: 'continue', sentenceType: 'Section 250 / Section 91' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'POST_RELEASE',
      } as MonitoringConditions)
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, req.body)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PRARR.replace(':orderId', mockOrder.id),
      )
    })
  })
})
