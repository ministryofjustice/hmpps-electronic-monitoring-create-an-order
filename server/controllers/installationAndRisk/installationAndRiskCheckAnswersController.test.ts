import { createAddress, createDeviceWearer, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AuditService from '../../services/auditService'
import CheckAnswersController from './installationAndRiskCheckAnswersController'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import installationAndRiskPageContent from '../../i18n/en/pages/installationAndRisk'
jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('InstallationAndRiskCheckAnswersController', () => {
  const taskListService = new TaskListService()
  let controller: CheckAnswersController
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  const { questions } = installationAndRiskPageContent
  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    controller = new CheckAnswersController(mockAuditService, taskListService)
  })

  it('should render the check answers page without any answers completed', async () => {
    // Given
    const order = getMockOrder()
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/installation-and-risk/check-your-answers', {
      riskInformation: [
        {
          key: {
            text: questions.offence.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.offence.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.riskCategory.text,
          },
          value: {
            html: '',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.riskCategory.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.riskDetails.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.riskDetails.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.mappaLevel.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.mappaLevel.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.mappaCaseType.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.mappaCaseType.text.toLowerCase(),
              },
            ],
          },
        },
      ],
    })
  })

  it('should render the check answers page all answers complete', async () => {
    // Given
    const order = getMockOrder({
      installationAndRisk: {
        offence: 'some offence',
        riskCategory: ['some risk category'],
        riskDetails: 'some risk details',
        mappaLevel: 'some mappaLevel',
        mappaCaseType: 'some mappaCaseType',
      },
    })
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/installation-and-risk/check-your-answers', {
      riskInformation: [
        {
          key: {
            text: questions.offence.text,
          },
          value: {
            text: 'some offence',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.offence.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.riskCategory.text,
          },
          value: {
            html: 'some risk category',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.riskCategory.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.riskDetails.text,
          },
          value: {
            text: 'some risk details',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.riskDetails.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.mappaLevel.text,
          },
          value: {
            text: 'some mappaLevel',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.mappaLevel.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.mappaCaseType.text,
          },
          value: {
            text: 'some mappaCaseType',
          },
          actions: {
            items: [
              {
                href: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.mappaCaseType.text.toLowerCase(),
              },
            ],
          },
        },
      ],
    })
  })
})
