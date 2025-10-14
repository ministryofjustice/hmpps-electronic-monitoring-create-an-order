import type { NextFunction, Request, Response } from 'express'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryMonitoringConditionsStore from '../store/inMemoryStore'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import CheckYourAnswersController from './controller'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { InterestedParties } from '../../../models/InterestedParties'

jest.mock('../monitoringConditionsStoreService')
jest.mock('../monitoringConditionsService')
jest.mock('../../../data/restClient')

const createInterestedParties = (overrides: Partial<InterestedParties> = {}): InterestedParties => {
  return {
    notifyingOrganisation: 'PROBATION',
    notifyingOrganisationName: '',
    notifyingOrganisationEmail: '',
    responsibleOfficerName: '',
    responsibleOfficerPhoneNumber: '',
    responsibleOrganisation: 'HOME_OFFICE',
    responsibleOrganisationRegion: '',
    responsibleOrganisationEmail: '',
    ...overrides,
  }
}

describe('check your answers controller', () => {
  let mockDataStore: InMemoryMonitoringConditionsStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockMonitoringConditionsService: jest.Mocked<MonitoringConditionsUpdateService>
  let mockRestClient: jest.Mocked<RestClient>
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    mockDataStore = new InMemoryMonitoringConditionsStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockMonitoringConditionsService = new MonitoringConditionsUpdateService(
      mockRestClient,
    ) as jest.Mocked<MonitoringConditionsUpdateService>

    req = createMockRequest()
    res = createMockResponse()
    next = jest.fn()
  })

  describe('view', () => {
    it('should render the correct view', async () => {
      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/order-type-description/check-your-answers',
        expect.anything(),
      )
    })

    it('should construct the correct model when orderType is answered', async () => {
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      })
      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        answers: [
          {
            key: {
              text: 'What is the order type?',
            },
            value: { text: 'Community' },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE.replace(
                    ':orderId',
                    req.order!.id,
                  ),
                  text: 'Change',
                  visuallyHiddenText: 'What is the order type?'.toLowerCase(),
                },
              ],
            },
          },
        ],
      })
    })

    it('should construct the correct model with both orderType and sentenceType', async () => {
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'POST_RELEASE',
        conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
        sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
      })
      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          answers: expect.arrayContaining([
            expect.objectContaining({ key: { text: 'What is the order type?' } }),
            expect.objectContaining({
              key: { text: 'What type of sentence has the device wearer been given?' },
              value: { text: 'Standard Determinate Sentence' },
              actions: expect.objectContaining({
                items: expect.arrayContaining([
                  expect.objectContaining({
                    href: expect.stringContaining('/sentence-type'),
                  }),
                ]),
              }),
            }),
          ]),
        }),
      )
    })
  })

  it('should construct the correct model for a Bail journey', async () => {
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      orderType: 'BAIL',
      conditionType: 'BAIL_ORDER',
      sentenceType: 'BAIL_RLAA',
    })
    const controller = new CheckYourAnswersController(
      mockMonitoringConditionsStoreService,
      mockMonitoringConditionsService,
    )

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        answers: expect.arrayContaining([
          expect.objectContaining({ key: { text: 'What is the order type?' } }),
          expect.objectContaining({
            key: { text: 'What type of bail has the device wearer been given?' },
            value: { text: 'Bail Remand to Local Authority Accomodation (RLAA)' },
          }),
        ]),
      }),
    )
  })

  it('should not display orderType for a PRISON journey but still display sentenceType', async () => {
    req.order = getMockOrder({ interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }) })
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
      orderType: 'POST_RELEASE',
      conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
      sentenceType: 'STANDARD_DETERMINATE_SENTENCE',
    })
    const controller = new CheckYourAnswersController(
      mockMonitoringConditionsStoreService,
      mockMonitoringConditionsService,
    )

    await controller.view(req, res, next)

    const { answers } = (res.render as jest.Mock).mock.calls[0][1]
    expect(answers).toHaveLength(1)
    expect(answers[0].key.text).toBe('What type of sentence has the device wearer been given?')
  })

  describe('update', () => {
    it('should submit the monitoring conditions', async () => {
      mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({
        orderType: 'COMMUNITY',
        conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
      })

      const controller = new CheckYourAnswersController(
        mockMonitoringConditionsStoreService,
        mockMonitoringConditionsService,
      )

      await controller.update(req, res, next)

      expect(mockMonitoringConditionsService.updateMonitoringConditions).toHaveBeenCalled()
    })
  })
})
