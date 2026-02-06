import type { NextFunction, Request, Response } from 'express'
import OrderTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import MonitoringConditionsStoreService from '../monitoringConditionsStoreService'
import InMemoryStore from '../store/inMemoryStore'
import { MonitoringConditions } from '../model'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { Order } from '../../../models/Order'
import { InterestedParties } from '../../../models/InterestedParties'
import { OrderTypeModel } from './viewModel'
import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import MonitoringConditionsUpdateService from '../monitoringConditionsService'

jest.mock('../monitoringConditionsStoreService')

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

describe('order type controller', () => {
  let mockDataStore: InMemoryStore
  let mockMonitoringConditionsStoreService: jest.Mocked<MonitoringConditionsStoreService>
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction
  let mockRestClient: jest.Mocked<RestClient>
  let mockService: jest.Mocked<MonitoringConditionsUpdateService>

  beforeEach(() => {
    mockDataStore = new InMemoryStore()
    mockMonitoringConditionsStoreService = new MonitoringConditionsStoreService(
      mockDataStore,
    ) as jest.Mocked<MonitoringConditionsStoreService>
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue({})

    mockOrder = getMockOrder()
    mockOrder.interestedParties = createInterestedParties()
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockService = new MonitoringConditionsUpdateService(
      mockRestClient,
    ) as jest.Mocked<MonitoringConditionsUpdateService>
    mockService.updateMonitoringConditions = jest.fn()
    req = createMockRequest()
    req.order = mockOrder
    req.flash = jest.fn()
    res = createMockResponse()
    next = jest.fn()
  })

  it('should render the correct view', async () => {
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/monitoring-conditions/order-type-description/order-type',
      expect.anything(),
    )
  })

  it('should construct the correct model when there is no data in the store', async () => {
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ orderType: { value: '' }, errorSummary: null }),
    )
  })

  it('should construct the correct model when there is data in the store', async () => {
    const data: MonitoringConditions = { orderType: 'COMMUNITY' }
    mockMonitoringConditionsStoreService.getMonitoringConditions.mockResolvedValue(data)

    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        orderType: { value: 'COMMUNITY' },
        errorSummary: null,
      }),
    )
  })

  it('should construct the correct model when there are errors', async () => {
    req.flash = jest.fn().mockReturnValueOnce([
      {
        error: 'Select the order type',
        field: 'orderType',
        focusTarget: 'orderType',
      },
    ])
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(res.render).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        orderType: { value: '', error: { text: 'Select the order type' } },
        errorSummary: {
          errorList: [{ href: '#orderType', text: 'Select the order type' }],
          titleText: 'There is a problem',
        },
      }),
    )
  })

  it('should construct the correct model when notifying org is probation', async () => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: 'PROBATION' })
    req.order = mockOrder
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    const expectedViewObject: OrderTypeModel = {
      orderTypeQuestions: [
        {
          question: 'Release from prison',
          hint: 'Monitoring is a condition of being released from prison following a custodial sentence.',
          value: 'POST_RELEASE',
        },
        {
          question: 'Community',
          hint: 'Managing community orders is not currently part of the service and any notifications should continue to be submitted by email.',
          value: 'COMMUNITY',
          disabled: true,
        },
      ],
      orderType: { value: '' },
      errorSummary: null,
    }

    expect(res.render).toHaveBeenCalledWith(expect.anything(), expectedViewObject)
  })

  it.each<{ notifyingOrg: NotifyingOrganisation }>([
    { notifyingOrg: 'CIVIL_COUNTY_COURT' },
    { notifyingOrg: 'CROWN_COURT' },
    { notifyingOrg: 'SCOTTISH_COURT' },
    { notifyingOrg: 'YOUTH_COURT' },
    { notifyingOrg: 'MILITARY_COURT' },
    { notifyingOrg: 'FAMILY_COURT' },
    { notifyingOrg: 'MAGISTRATES_COURT' },
  ])('should construct the correct model when notifying org is %notifyingOrg', async ({ notifyingOrg }) => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: notifyingOrg })
    req.order = mockOrder
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    const expectedViewObject: OrderTypeModel = {
      orderTypeQuestions: [
        {
          question: 'Community',
          hint: 'Monitoring is a condition of a court order where they were convicted of a crime, but received a community rather than custodial sentence.',
          value: 'COMMUNITY',
        },
        {
          question: 'Bail',
          hint: 'Monitoring is a condition of bail.',
          value: 'BAIL',
        },
        {
          question: 'Civil',
          hint: 'Monitoring is a condition of a civil court order, rather than a criminal one.',
          value: 'CIVIL',
        },
      ],
      orderType: { value: '' },
      errorSummary: null,
    }

    expect(res.render).toHaveBeenCalledWith(expect.anything(), expectedViewObject)
  })

  // TODO: prison and home office redirects
  it('should save order type and redirect if notifyingOrg is prison', async () => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: 'PRISON' })
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(mockMonitoringConditionsStoreService.updateOrderType).toHaveBeenCalledWith(mockOrder, {
      orderType: 'POST_RELEASE',
    })

    expect(res.redirect).toHaveBeenCalledWith(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', mockOrder.id),
    )
  })

  it('should save order type and redirect if notifyingOrg is ycs', async () => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE' })
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(mockMonitoringConditionsStoreService.updateOrderType).toHaveBeenCalledWith(mockOrder, {
      orderType: 'POST_RELEASE',
    })

    expect(res.redirect).toHaveBeenCalledWith(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE.replace(':orderId', mockOrder.id),
    )
  })

  it('should save order type and redirect if notifyingOrg is home office', async () => {
    mockOrder.interestedParties = createInterestedParties({ notifyingOrganisation: 'HOME_OFFICE' })
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.view(req, res, next)

    expect(mockMonitoringConditionsStoreService.updateOrderType).toHaveBeenCalledWith(mockOrder, {
      orderType: 'IMMIGRATION',
    })
    expect(res.redirect).toHaveBeenCalledWith(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.MONITORING_TYPES.replace(':orderId', mockOrder.id),
    )
  })

  it('should save the form to storage when the action is continue', async () => {
    req.body = {
      action: 'continue',
      orderType: 'CIVIL',
    }
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.update(req, res, next)

    expect(mockMonitoringConditionsStoreService.updateOrderType).toHaveBeenCalled()
  })

  it('should redirect to view with errors when orderType is missing', async () => {
    req.body = {
      action: 'continue',
    }
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.update(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE.replace(':orderId', mockOrder.id),
    )
  })

  it('should flash the request with the correct errors when orderType is missing', async () => {
    req.body = {
      action: 'continue',
    }
    const controller = new OrderTypeController(mockMonitoringConditionsStoreService, mockService)

    await controller.update(req, res, next)

    expect(req.flash).toHaveBeenCalledWith('validationErrors', [
      { error: 'Select the order type', field: 'orderType', focusTarget: 'orderType' },
    ])
  })
})
