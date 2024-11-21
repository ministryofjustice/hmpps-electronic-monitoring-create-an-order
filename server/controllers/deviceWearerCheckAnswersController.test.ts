import type { Request, Response } from 'express'
import { getMockOrder } from '../../test/mocks/mockOrder'
import HmppsAuditClient from '../data/hmppsAuditClient'
import { Order, OrderStatus, OrderStatusEnum } from '../models/Order'
import AuditService from '../services/auditService'
import DeviceWearerCheckAnswersController from './deviceWearersCheckAnswersController'

jest.mock('../services/auditService')
jest.mock('../services/orderService')
jest.mock('../services/deviceWearerService')
jest.mock('../data/hmppsAuditClient')
jest.mock('../data/restClient')

const createMockRequest = (order?: Order): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {
      orderId: '123456789',
    },
    user: {
      username: '',
      token: '',
      authSource: '',
    },
    order,
  }
}

const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
    locals: {
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'nomis',
        userId: 'fakeId',
        name: 'fake user',
        displayName: 'fuser',
        userRoles: ['fakeRole'],
        staffId: 123,
      },
    },
    redirect: jest.fn(),
    render: jest.fn(),
    set: jest.fn(),
    send: jest.fn(),
  }
}

const createMockOrder = (status: OrderStatus): Order => {
  return {
    ...getMockOrder({ status }),
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      homeOfficeReferenceNumber: null,
      firstName: 'tester',
      lastName: 'testington',
      alias: 'test',
      dateOfBirth: '1980-01-01T00:00:00.000Z',
      adultAtTimeOfInstallation: false,
      sex: 'male',
      gender: 'male',
      disabilities: ['VISION', 'MOBILITY'],
      noFixedAbode: null,
      interpreterRequired: false,
      language: null,
    },
    deviceWearerResponsibleAdult: {
      relationship: 'Parent',
      otherRelationshipDetails: null,
      fullName: 'Firstname Lastname',
      contactNumber: '07999999999',
    },
  }
}

describe('DeviceWearerCheckAnswersController', () => {
  let deviceWearerCheckAnswersController: DeviceWearerCheckAnswersController
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    deviceWearerCheckAnswersController = new DeviceWearerCheckAnswersController(mockAuditService)
  })

  it('should render the page using the saved device wearer and responsible adult data', async () => {
    // Given
    const mockOrder = createMockOrder(OrderStatusEnum.Enum.IN_PROGRESS)
    const req = createMockRequest(mockOrder)
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await deviceWearerCheckAnswersController.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(
      'pages/order/about-the-device-wearer/check-your-answers',
      expect.objectContaining({
        aboutTheDeviceWearerUri: '/order/123456789/about-the-device-wearer',
        adultAtTimeOfInstallation: 'No',
        alias: 'test',
        dateOfBirth_day: '1',
        dateOfBirth_month: '1',
        dateOfBirth_year: '1980',
        deliusId: '',
        deviceWearerResponsibleAdultUri: '/order/123456789/about-the-device-wearer/responsible-adult',
        disabilities: ['VISION', 'MOBILITY'],
        displayResponsibleAdult: true,
        firstName: 'tester',
        gender: 'male',
        homeOfficeReferenceNumber: '',
        interpreterRequired: 'No',
        language: '',
        lastName: 'testington',
        nomisId: '',
        orderSummaryUri: '/order/123456789/summary',
        pncId: '',
        prisonNumber: '',
        responsibleAdultContactNumber: '07999999999',
        responsibleAdultFullName: 'Firstname Lastname',
        responsibleAdultOtherRelationshipDetails: '',
        responsibleAdultRelationship: 'Parent',
        sex: 'male',
      }),
    )
  })
})
