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
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
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
    it('should render the correct view', async () => {
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/sentence-type',
        expect.anything(),
      )
    })

    it('should construct the correct model when there is no data in the store', async () => {
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ sentenceType: { value: '' }, errorSummary: null }),
      )
    })

    it('should construct the correct model when there is data in the store', async () => {
      const data: Partial<MonitoringConditions> = { sentenceType: 'Standard Determinate Sentence' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data as MonitoringConditions)
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sentenceType: { value: 'Standard Determinate Sentence' },
        }),
      )
    })

    it('should construct the correct model when there are errors', async () => {
      req.flash = jest.fn().mockReturnValueOnce([
        {
          error: validationErrors.monitoringConditions.sentenceTypeRequired,
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sentenceType: { value: '', error: { text: validationErrors.monitoringConditions.sentenceTypeRequired } },
          errorSummary: expect.anything(),
        }),
      )
    })

    it('should construct the correct model when the order type is POST_RELEASE', async () => {
      const data: Partial<MonitoringConditions> = { orderType: 'POST_RELEASE' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data as MonitoringConditions)
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pageTitle: 'What type of sentence has the device wearer been given?',
          sentenceTypeQuestions: expect.arrayContaining([
            expect.objectContaining({ value: 'Standard Determinate Sentence' }),
          ]),
        }),
      )
    })
  })

  describe('update', () => {
    it('should save the form to storage when the action is continue', async () => {
      req.body = { action: 'continue', sentenceType: 'Standard Determinate Sentence' }
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalled()
    })

    it('should redirect to view with errors when sentenceType is missing', async () => {
      req.body = { action: 'continue' }
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', mockOrder.id),
      )
    })

    it('should flash the request with the correct errors when sentenceType is missing', async () => {
      req.body = { action: 'continue' }
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.monitoringConditions.sentenceTypeRequired,
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
    })

    describe('POST_RELEASE routing', () => {
      it("should save and redirect for 'Standard Determinate Sentence'", async () => {
        req.body = { action: 'continue', sentenceType: 'Standard Determinate Sentence' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'POST_RELEASE',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to HDC page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })

      it("should save and redirect for 'Detention and Training Order (DTO)'", async () => {
        req.body = { action: 'continue', sentenceType: 'Detention and Training Order (DTO)' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'POST_RELEASE',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to ISS page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })

      it('should save and redirect for any other sentence', async () => {
        req.body = { action: 'continue', sentenceType: 'Section 250 / Section 91' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'POST_RELEASE',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to PRARR page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })
    })

    describe('COMMUNITY routing', () => {
      it("should save and redirect for 'Community YRO'", async () => {
        req.body = { action: 'continue', sentenceType: 'Community YRO' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'COMMUNITY',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to ISS page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })

      it('should save and redirect for any other sentence', async () => {
        req.body = { action: 'continue', sentenceType: 'Community SDO' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'COMMUNITY',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to Monitoring Dates page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })
    })

    describe('BAIL routing', () => {
      it('should save and redirect for any bail option', async () => {
        req.body = { action: 'continue', sentenceType: 'Bail Supervision & Support' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'BAIL',
        } as MonitoringConditions)
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)
        // TODO: Update to ISS page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })
    })
  })
})
