import { createAddress, createDeviceWearer, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AuditService from '../../services/auditService'
import CheckAnswersController from './checkAnswersController'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/deviceWearerService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('ContactDetailsCheckAnswersController', () => {
  const taskListService = new TaskListService()
  let controller: CheckAnswersController
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
    controller = new CheckAnswersController(mockAuditService, taskListService)
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
    expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/check-your-answers', {
      contactDetails: [
        {
          key: {
            text: 'Contact number',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'contact number',
              },
            ],
          },
        },
      ],
      addresses: [
        {
          key: {
            text: 'Does the device wearer have a fixed address?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'does the device wearer have a fixed address?',
              },
            ],
          },
        },
      ],
      interestedParties: [
        {
          key: {
            text: 'What is the email address for your team?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the email address for your team?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Full name of responsible officer',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'full name of responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible officer',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'What organisation is the responsible officer part of?',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what organisation is the responsible officer part of?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What region is the responsible organisation in? (optional)',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what region is the responsible organisation in? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the address of the responsible organisation?',
          },
          value: {
            html: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the address of the responsible organisation?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible organisation',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible organisation',
              },
            ],
          },
        },
        {
          key: {
            text: 'Email address for responsible organisation',
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'email address for responsible organisation',
              },
            ],
          },
        },
      ],
    })
  })

  it('should render the check answers page using saved data for an device wearer with no fixed abode', async () => {
    // Given
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ noFixedAbode: true }),
      contactDetails: { contactNumber: '01234567890' },
      interestedParties: {
        notifyingOrganisationEmail: 'test@test',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationAddressLine1: 'Line 1',
        responsibleOrganisationAddressLine2: 'Line 2',
        responsibleOrganisationAddressLine3: 'Line 3',
        responsibleOrganisationAddressLine4: 'Line 4',
        responsibleOrganisationAddressPostcode: 'Postcode',
        responsibleOrganisationEmail: 'test@test.com',
        responsibleOrganisationPhoneNumber: '01234567891',
        responsibleOrganisationRegion: 'East',
      },
      addresses: [
        createAddress({
          addressType: 'RESPONSIBLE_ORGANISATION',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          postcode: 'Postcode',
        }),
      ],
    })
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/check-your-answers', {
      contactDetails: [
        {
          key: {
            text: 'Contact number',
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'contact number',
              },
            ],
          },
        },
      ],
      addresses: [
        {
          key: {
            text: 'Does the device wearer have a fixed address?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'does the device wearer have a fixed address?',
              },
            ],
          },
        },
      ],
      interestedParties: [
        {
          key: {
            text: 'What is the email address for your team?',
          },
          value: {
            text: 'test@test',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the email address for your team?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Full name of responsible officer',
          },
          value: {
            text: 'John Smith',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'full name of responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible officer',
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'What organisation is the responsible officer part of?',
          },
          value: {
            text: 'Home Office',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what organisation is the responsible officer part of?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What region is the responsible organisation in? (optional)',
          },
          value: {
            text: 'East',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what region is the responsible organisation in? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the address of the responsible organisation?',
          },
          value: {
            html: 'Line 1, Line 2, Postcode',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the address of the responsible organisation?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible organisation',
          },
          value: {
            text: '01234567891',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible organisation',
              },
            ],
          },
        },
        {
          key: {
            text: 'Email address for responsible organisation',
          },
          value: {
            text: 'test@test.com',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'email address for responsible organisation',
              },
            ],
          },
        },
      ],
    })
  })

  it('should render the check answers page using saved data for an device wearer with a fixed abode', async () => {
    // Given
    const order = getMockOrder({
      deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      contactDetails: { contactNumber: '01234567890' },
      interestedParties: {
        notifyingOrganisationEmail: 'test@test',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationAddressLine1: 'Line 1',
        responsibleOrganisationAddressLine2: 'Line 2',
        responsibleOrganisationAddressLine3: 'Line 3',
        responsibleOrganisationAddressLine4: 'Line 4',
        responsibleOrganisationAddressPostcode: 'Postcode',
        responsibleOrganisationEmail: 'test@test.com',
        responsibleOrganisationPhoneNumber: '01234567891',
        responsibleOrganisationRegion: 'East',
      },
      addresses: [
        createAddress({
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          postcode: 'Postcode',
        }),
        createAddress({
          addressType: 'SECONDARY',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          postcode: 'Postcode',
        }),
        createAddress({
          addressType: 'TERTIARY',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          postcode: 'Postcode',
        }),
        createAddress({
          addressType: 'RESPONSIBLE_ORGANISATION',
          addressLine1: 'Line 1',
          addressLine2: 'Line 2',
          postcode: 'Postcode',
        }),
      ],
    })
    const req = createMockRequest({ order })
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await controller.view(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/order/contact-information/check-your-answers', {
      contactDetails: [
        {
          key: {
            text: 'Contact number',
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'contact number',
              },
            ],
          },
        },
      ],
      addresses: [
        {
          key: {
            text: 'Does the device wearer have a fixed address?',
          },
          value: {
            text: 'Yes',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'does the device wearer have a fixed address?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Primary address',
          },
          value: {
            html: 'Line 1, Line 2, Postcode',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.ADDRESSES.replace(
                  ':addressType(primary|secondary|tertiary)',
                  'primary',
                ).replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'primary address',
              },
            ],
          },
        },
        {
          key: {
            text: 'Secondary address',
          },
          value: {
            html: 'Line 1, Line 2, Postcode',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.ADDRESSES.replace(
                  ':addressType(primary|secondary|tertiary)',
                  'secondary',
                ).replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'secondary address',
              },
            ],
          },
        },
        {
          key: {
            text: 'Tertiary address',
          },
          value: {
            html: 'Line 1, Line 2, Postcode',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.ADDRESSES.replace(
                  ':addressType(primary|secondary|tertiary)',
                  'tertiary',
                ).replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'tertiary address',
              },
            ],
          },
        },
      ],
      interestedParties: [
        {
          key: {
            text: 'What is the email address for your team?',
          },
          value: {
            text: 'test@test',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the email address for your team?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Full name of responsible officer',
          },
          value: {
            text: 'John Smith',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'full name of responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible officer',
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible officer',
              },
            ],
          },
        },
        {
          key: {
            text: 'What organisation is the responsible officer part of?',
          },
          value: {
            text: 'Home Office',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what organisation is the responsible officer part of?',
              },
            ],
          },
        },
        {
          key: {
            text: 'What region is the responsible organisation in? (optional)',
          },
          value: {
            text: 'East',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what region is the responsible organisation in? (optional)',
              },
            ],
          },
        },
        {
          key: {
            text: 'What is the address of the responsible organisation?',
          },
          value: {
            html: 'Line 1, Line 2, Postcode',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'what is the address of the responsible organisation?',
              },
            ],
          },
        },
        {
          key: {
            text: 'Telephone number for responsible organisation',
          },
          value: {
            text: '01234567891',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'telephone number for responsible organisation',
              },
            ],
          },
        },
        {
          key: {
            text: 'Email address for responsible organisation',
          },
          value: {
            text: 'test@test.com',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: 'email address for responsible organisation',
              },
            ],
          },
        },
      ],
    })
  })
})
