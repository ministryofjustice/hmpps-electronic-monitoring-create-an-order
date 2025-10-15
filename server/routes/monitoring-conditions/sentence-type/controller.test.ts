import type { NextFunction, Request, Response } from 'express'
import SentenceTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import { MonitoringConditions } from '../model'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import paths from '../../../constants/paths'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { validationErrors } from '../../../constants/validationErrors'

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
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})

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

    it('should construct the correct model when there is data in the store', async () => {
      const data: Partial<MonitoringConditions> = { sentenceType: 'STANDARD_DETERMINATE_SENTENCE' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data)

      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sentenceType: { value: 'STANDARD_DETERMINATE_SENTENCE' },
          errorSummary: null,
        }),
      )
    })

    it('should construct the correct model when there are errors', async () => {
      req.flash = jest.fn().mockReturnValueOnce([
        {
          error: 'Select the type of sentence the device wearer has been given',
          field: 'sentenceType',
          focusTarget: 'sentenceType',
        },
      ])
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sentenceType: { value: '', error: { text: 'Select the type of sentence the device wearer has been given' } },
          errorSummary: {
            errorList: [
              { href: '#sentenceType', text: 'Select the type of sentence the device wearer has been given' },
            ],
            titleText: 'There is a problem',
          },
        }),
      )
    })

    it('should construct the correct model when the order type is POST_RELEASE', async () => {
      const data: Partial<MonitoringConditions> = { orderType: 'POST_RELEASE' }

      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data)

      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.view(req, res, next)
      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          pageHeading: 'What type of sentence has the device wearer been given?',
          sentenceTypeQuestions: expect.arrayContaining([
            expect.objectContaining({ value: 'STANDARD_DETERMINATE_SENTENCE' }),
          ]),
        }),
      )
    })
  })

  describe('update', () => {
    it('should save the form to storage when the action is continue', async () => {
      req.body = { action: 'continue', sentenceType: 'STANDARD_DETERMINATE_SENTENCE' }
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
      it("should save and redirect to HDC page for 'STANDARD_DETERMINATE_SENTENCE'", async () => {
        req.body = { action: 'continue', sentenceType: 'STANDARD_DETERMINATE_SENTENCE' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'POST_RELEASE',
        })
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)

        expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, {
          sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
        })
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC.replace(':orderId', mockOrder.id),
        )
      })

      it("should save and redirect to PRARR page for 'SECTION_91'", async () => {
        req.body = { action: 'continue', sentenceType: 'SECTION_91' }
        mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
          orderType: 'POST_RELEASE',
        })
        const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
        await controller.update(req, res, next)

        expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, {
          sentenceType: 'SECTION_91',
        })
        // TODO: Update to PRARR page when it is made
        expect(res.redirect).toHaveBeenCalledWith(
          paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
        )
      })
    })

    it("should save and redirect for 'COMMUNITY_YRO'", async () => {
      req.body = { action: 'continue', sentenceType: 'COMMUNITY_YRO' }
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
      })
      const controller = new SentenceTypeController(mockMonitoringConditionsStoreService)
      await controller.update(req, res, next)

      expect(mockMonitoringConditionsStoreService.updateSentenceType).toHaveBeenCalledWith(mockOrder.id, {
        sentenceType: 'COMMUNITY_YRO',
      })
      // TODO: Update to ISS page when it is made
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.CHECK_YOUR_ANSWERS.replace(':orderId', mockOrder.id),
      )
    })
  })
})
