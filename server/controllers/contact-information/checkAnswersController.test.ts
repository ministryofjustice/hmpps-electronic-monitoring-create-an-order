import { createAddress, createDeviceWearer, getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import AuditService from '../../services/auditService'
import CheckAnswersController from './checkAnswersController'
import TaskListService from '../../services/taskListService'
import paths from '../../constants/paths'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import interestedPartiesPageContent from '../../i18n/en/pages/interestedParties'

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
  const { questions } = interestedPartiesPageContent
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
            text: "What is the device wearer's telephone number? (optional)",
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's telephone number? (optional)",
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
            text: questions.notifyingOrganisation.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisation.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.notifyingOrganisationEmail.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisationEmail.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerName.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerName.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerPhoneNumber.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerPhoneNumber.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOrganisation.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisation.text.toLowerCase(),
              },
            ],
          },
        },

        {
          key: {
            text: questions.responsibleOrganisationEmail.text,
          },
          value: {
            text: '',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisationEmail.text.toLowerCase(),
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
        notifyingOrganisation: 'HOME_OFFICE',
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: 'test@test',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationEmail: 'test@test.com',
        responsibleOrganisationRegion: '',
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
            text: "What is the device wearer's telephone number? (optional)",
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's telephone number? (optional)",
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
            text: questions.notifyingOrganisation.text,
          },
          value: {
            text: 'Home Office',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisation.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.notifyingOrganisationEmail.text,
          },
          value: {
            text: 'test@test',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisationEmail.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerName.text,
          },
          value: {
            text: 'John Smith',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerName.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerPhoneNumber.text,
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerPhoneNumber.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOrganisation.text,
          },
          value: {
            text: 'Home Office',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisation.text.toLowerCase(),
              },
            ],
          },
        },

        {
          key: {
            text: questions.responsibleOrganisationEmail.text,
          },
          value: {
            text: 'test@test.com',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisationEmail.text.toLocaleLowerCase(),
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
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'CARDIFF_PRISON',
        notifyingOrganisationEmail: 'test@test',
        responsibleOfficerName: 'John Smith',
        responsibleOfficerPhoneNumber: '01234567890',
        responsibleOrganisation: 'PROBATION',
        responsibleOrganisationEmail: 'test@test.com',
        responsibleOrganisationRegion: 'NORTH_EAST',
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
            text: "What is the device wearer's telephone number? (optional)",
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: "what is the device wearer's telephone number? (optional)",
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
            text: "What is the device wearer's main address?",
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
                visuallyHiddenText: "what is the device wearer's main address?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's second address?",
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
                visuallyHiddenText: "what is the device wearer's second address?",
              },
            ],
          },
        },
        {
          key: {
            text: "What is the device wearer's third address?",
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
                visuallyHiddenText: "what is the device wearer's third address?",
              },
            ],
          },
        },
      ],
      interestedParties: [
        {
          key: {
            text: questions.notifyingOrganisation.text,
          },
          value: {
            text: 'Prison',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisation.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.prison.text,
          },
          value: {
            text: 'Cardiff Prison',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.prison.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.notifyingOrganisationEmail.text,
          },
          value: {
            text: 'test@test',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.notifyingOrganisationEmail.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerName.text,
          },
          value: {
            text: 'John Smith',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerName.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOfficerPhoneNumber.text,
          },
          value: {
            text: '01234567890',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOfficerPhoneNumber.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOrganisation.text,
          },
          value: {
            text: 'Probation',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisation.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.probationRegion.text,
          },
          value: {
            text: 'North East',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.probationRegion.text.toLowerCase(),
              },
            ],
          },
        },
        {
          key: {
            text: questions.responsibleOrganisationEmail.text,
          },
          value: {
            text: 'test@test.com',
          },
          actions: {
            items: [
              {
                href: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
                text: 'Change',
                visuallyHiddenText: questions.responsibleOrganisationEmail.text.toLowerCase(),
              },
            ],
          },
        },
      ],
    })
  })
})
