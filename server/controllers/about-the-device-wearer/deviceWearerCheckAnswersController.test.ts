import { createDeviceWearer, createResponsibleAdult, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AuditService from '../../services/auditService'
import DeviceWearerCheckAnswersController from './deviceWearerCheckAnswersController'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const adultDeviceWearer = createDeviceWearer({
  nomisId: 'nomis',
  pncId: 'pnc',
  deliusId: 'delius',
  prisonNumber: 'prison',
  homeOfficeReferenceNumber: 'home office',
  firstName: 'tester',
  lastName: 'testington',
  alias: 'test',
  dateOfBirth: '1980-10-10T00:00:00.000Z',
  adultAtTimeOfInstallation: true,
  sex: 'MALE',
  gender: 'MALE',
  disabilities: ['VISION', 'MOBILITY'],
  interpreterRequired: false,
})

const childDeviceWearer = {
  ...adultDeviceWearer,
  adultAtTimeOfInstallation: false,
}

const responsibleAdult = createResponsibleAdult({
  relationship: 'parent',
  fullName: 'Firstname Lastname',
  contactNumber: '07999999999',
})

describe('DeviceWearerCheckAnswersController', () => {
  const taskListService = new TaskListService()
  let controller: DeviceWearerCheckAnswersController
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
    controller = new DeviceWearerCheckAnswersController(mockAuditService, taskListService)
  })

  it('should render the check answers page without any answers completed', async () => {
    // Given
    const order = getMockOrder()
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/check-your-answers', {
      deviceWearer: [
        {
          key: {
            text: "What is the device wearer's first name?",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's first name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's last name?",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's last name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's preferred name or names? (optional)",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's preferred name or names? (optional)",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's date of birth?",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's date of birth?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Is a responsible adult required?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is a responsible adult required?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the sex of the device wearer?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the sex of the device wearer?',
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's gender?",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's gender?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Does the device wearer have any of the disabilities or health conditions listed? (optional)',
          },
          value: {
            html: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText:
                  'does the device wearer have any of the disabilities or health conditions listed? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What language does the interpreter need to use? (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what language does the interpreter need to use? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter needed?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter needed?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'National Offender Management Information System (NOMIS) ID (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'national offender management information system (nomis) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Police National Computer (PNC) ID (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'police national computer (pnc) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Delius ID (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'delius id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Prison number (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'prison number (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Home Office Reference Number (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'home office reference number (optional)',
              },
            ],
          },
        },
      ],
      responsibleAdult: [],
    })
  })

  it('should render the check answers page using saved data for an adult device wearer', async () => {
    // Given
    const order = getMockOrder({ deviceWearer: adultDeviceWearer })
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/check-your-answers', {
      deviceWearer: [
        {
          key: {
            text: "What is the device wearer's first name?",
          },
          value: {
            text: 'tester',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's first name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's last name?",
          },
          value: {
            text: 'testington',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's last name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's preferred name or names? (optional)",
          },
          value: {
            text: 'test',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's preferred name or names? (optional)",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's date of birth?",
          },
          value: {
            text: '10/10/1980',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's date of birth?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Is a responsible adult required?',
          },
          value: {
            text: 'Yes',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is a responsible adult required?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the sex of the device wearer?',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the sex of the device wearer?',
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's gender?",
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's gender?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Does the device wearer have any of the disabilities or health conditions listed? (optional)',
          },
          value: {
            html: 'Vision<br/>Mobility',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText:
                  'does the device wearer have any of the disabilities or health conditions listed? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What language does the interpreter need to use? (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what language does the interpreter need to use? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter needed?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter needed?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'National Offender Management Information System (NOMIS) ID (optional)',
          },
          value: {
            text: 'nomis',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'national offender management information system (nomis) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Police National Computer (PNC) ID (optional)',
          },
          value: {
            text: 'pnc',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'police national computer (pnc) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Delius ID (optional)',
          },
          value: {
            text: 'delius',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'delius id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Prison number (optional)',
          },
          value: {
            text: 'prison',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'prison number (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Home Office Reference Number (optional)',
          },
          value: {
            text: 'home office',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'home office reference number (optional)',
              },
            ],
          },
        },
      ],
      responsibleAdult: [],
    })
  })

  it('should render the check answers page using the saved for a child device wearer', async () => {
    // Given
    const order = getMockOrder({ deviceWearer: childDeviceWearer, deviceWearerResponsibleAdult: responsibleAdult })
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/check-your-answers', {
      deviceWearer: [
        {
          key: {
            text: "What is the device wearer's first name?",
          },
          value: {
            text: 'tester',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's first name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's last name?",
          },
          value: {
            text: 'testington',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's last name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's preferred name or names? (optional)",
          },
          value: {
            text: 'test',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's preferred name or names? (optional)",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's date of birth?",
          },
          value: {
            text: '10/10/1980',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's date of birth?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Is a responsible adult required?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is a responsible adult required?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the sex of the device wearer?',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the sex of the device wearer?',
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's gender?",
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's gender?",
              },
            ],
          },
        },
        {
          key: {
            text: 'Does the device wearer have any of the disabilities or health conditions listed? (optional)',
          },
          value: {
            html: 'Vision<br/>Mobility',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText:
                  'does the device wearer have any of the disabilities or health conditions listed? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What language does the interpreter need to use? (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what language does the interpreter need to use? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter needed?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter needed?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'National Offender Management Information System (NOMIS) ID (optional)',
          },
          value: {
            text: 'nomis',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'national offender management information system (nomis) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Police National Computer (PNC) ID (optional)',
          },
          value: {
            text: 'pnc',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'police national computer (pnc) id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Delius ID (optional)',
          },
          value: {
            text: 'delius',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'delius id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Prison number (optional)',
          },
          value: {
            text: 'prison',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'prison number (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Home Office Reference Number (optional)',
          },
          value: {
            text: 'home office',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'home office reference number (optional)',
              },
            ],
          },
        },
      ],
      responsibleAdult: [
        {
          key: {
            text: "What is the responsible adult's relationship to the device wearer?",
          },
          value: {
            text: 'Parent',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the responsible adult's relationship to the device wearer?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the responsible adult's full name?",
          },
          value: {
            text: 'Firstname Lastname',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the responsible adult's full name?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the responsible adult's telephone number? (optional)",
          },
          value: {
            text: '07999999999',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the responsible adult's telephone number? (optional)",
              },
            ],
          },
        },
      ],
    })
  })
})
