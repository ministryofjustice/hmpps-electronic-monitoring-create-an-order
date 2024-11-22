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
  sex: 'male',
  gender: 'male',
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
            text: 'First names',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'first names',
              },
            ],
          },
        },
        {
          key: {
            text: 'Last name',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'last name',
              },
            ],
          },
        },
        {
          key: {
            text: 'Preferred name or alias (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'preferred name or alias (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Date of birth',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'date of birth',
              },
            ],
          },
        },
        {
          key: {
            text: 'Will the device wearer be 18 years old when the device is installed?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'will the device wearer be 18 years old when the device is installed?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Sex',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'sex',
              },
            ],
          },
        },
        {
          key: {
            text: 'Gender',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'gender',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disabilities (optional)',
          },
          value: {
            html: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disabilities (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disability, if other (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disability, if other (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Main language',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'main language',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter required?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter required?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'NOMIS ID (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'nomis id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'PNC ID (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'pnc id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'DELIUS ID (optional)',
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
            text: 'Home Office reference number (optional)',
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
            text: 'First names',
          },
          value: {
            text: 'tester',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'first names',
              },
            ],
          },
        },
        {
          key: {
            text: 'Last name',
          },
          value: {
            text: 'testington',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'last name',
              },
            ],
          },
        },
        {
          key: {
            text: 'Preferred name or alias (optional)',
          },
          value: {
            text: 'test',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'preferred name or alias (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Date of birth',
          },
          value: {
            text: '10/10/1980',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'date of birth',
              },
            ],
          },
        },
        {
          key: {
            text: 'Will the device wearer be 18 years old when the device is installed?',
          },
          value: {
            text: 'Yes',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'will the device wearer be 18 years old when the device is installed?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Sex',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'sex',
              },
            ],
          },
        },
        {
          key: {
            text: 'Gender',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'gender',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disabilities (optional)',
          },
          value: {
            html: 'Vision<br/>Mobility',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disabilities (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disability, if other (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disability, if other (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Main language',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'main language',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter required?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter required?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'NOMIS ID (optional)',
          },
          value: {
            text: 'nomis',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'nomis id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'PNC ID (optional)',
          },
          value: {
            text: 'pnc',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'pnc id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'DELIUS ID (optional)',
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
            text: 'Home Office reference number (optional)',
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
            text: 'First names',
          },
          value: {
            text: 'tester',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'first names',
              },
            ],
          },
        },
        {
          key: {
            text: 'Last name',
          },
          value: {
            text: 'testington',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'last name',
              },
            ],
          },
        },
        {
          key: {
            text: 'Preferred name or alias (optional)',
          },
          value: {
            text: 'test',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'preferred name or alias (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Date of birth',
          },
          value: {
            text: '10/10/1980',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'date of birth',
              },
            ],
          },
        },
        {
          key: {
            text: 'Will the device wearer be 18 years old when the device is installed?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'will the device wearer be 18 years old when the device is installed?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Sex',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'sex',
              },
            ],
          },
        },
        {
          key: {
            text: 'Gender',
          },
          value: {
            text: 'Male',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'gender',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disabilities (optional)',
          },
          value: {
            html: 'Vision<br/>Mobility',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disabilities (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Disability, if other (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'disability, if other (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Main language',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'main language',
              },
            ],
          },
        },
        {
          key: {
            text: 'Is an interpreter required?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'is an interpreter required?',
              },
            ],
          },
        },
      ],
      personIdentifiers: [
        {
          key: {
            text: 'NOMIS ID (optional)',
          },
          value: {
            text: 'nomis',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'nomis id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'PNC ID (optional)',
          },
          value: {
            text: 'pnc',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'pnc id (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'DELIUS ID (optional)',
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
            text: 'Home Office reference number (optional)',
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
            text: 'Relationship',
          },
          value: {
            text: 'Parent',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'relationship',
              },
            ],
          },
        },
        {
          key: {
            text: 'Relationship details, if other (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'relationship details, if other (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'Full name',
          },
          value: {
            text: 'Firstname Lastname',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'full name',
              },
            ],
          },
        },
        {
          key: {
            text: 'Contact number',
          },
          value: {
            text: '07999999999',
          },
          actions: {
            items: [
              {
                href: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'contact number',
              },
            ],
          },
        },
      ],
    })
  })
})
