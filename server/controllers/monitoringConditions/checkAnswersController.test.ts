import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import {
  createAddress,
  createCurfewConditions,
  createCurfewReleaseDateConditions,
  createMonitoringConditions,
  getMockOrder,
} from '../../../test/mocks/mockOrder'
import paths from '../../constants/paths'
import questions from '../../constants/questions'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import EnforcementZoneTypes from '../../models/EnforcementZoneTypes'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import CheckAnswersController from './checkAnswersController'

jest.mock('../../data/hmppsAuditClient')
jest.mock('../../services/auditService')

describe('MonitoringConditionsCheckAnswersController', () => {
  const taskListService = new TaskListService()
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>
  let controller: CheckAnswersController

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

  describe('view', () => {
    it('should render the check answers page without any answers completed', async () => {
      // Given
      const order = getMockOrder()
      const req = createMockRequest({
        order,
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/check-your-answers', {
        monitoringConditions: [
          {
            key: {
              text: 'Start date',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'start date',
                },
              ],
            },
          },
          {
            key: {
              text: 'Start time',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'start time',
                },
              ],
            },
          },
          {
            key: {
              text: 'End date',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'end date',
                },
              ],
            },
          },
          {
            key: {
              text: 'End time',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'end time',
                },
              ],
            },
          },
          {
            key: {
              text: 'Order type',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'order type',
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.orderTypeDescription,
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.orderTypeDescription.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: 'Condition type',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'condition type',
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.sentenceType,
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.sentenceType.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.issp,
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.issp.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.hdc,
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.hdc.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.prarr,
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.prarr.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: 'What monitoring does the device wearer need?',
            },
            value: {
              html: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what monitoring does the device wearer need?',
                },
              ],
            },
          },
        ],
        installationAddress: [
          {
            key: {
              text: 'Address line 1',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 1',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 2',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 2',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 3',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 3',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 4',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 4',
                },
              ],
            },
          },
          {
            key: {
              text: 'Postcode',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'postcode',
                },
              ],
            },
          },
        ],
        curfew: [],
        curfewTimetable: [],
        exclusionZone: [],
        trail: [],
        attendance: [],
        alcohol: [],
      })
    })

    it('should render the check answers with all answers completed', async () => {
      // Given
      const conditionId = 'e8c7eeee-7cff-4c59-a0f2-7b8c23a82d94'
      const order = getMockOrder({
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
            addressType: 'INSTALLATION',
            addressLine1: 'Line 1',
            addressLine2: 'Line 2',
            postcode: 'Postcode',
          }),
        ],
        monitoringConditions: createMonitoringConditions({
          alcohol: true,
          conditionType: 'REQUIREMENT_OF_A_COMMUNITY_ORDER',
          curfew: true,
          endDate: '2024-11-11T01:01:00Z',
          exclusionZone: true,
          mandatoryAttendance: true,
          orderType: 'PRE_TRIAL',
          orderTypeDescription: 'GPS_ACQUISITIVE_CRIME_HDC',
          startDate: '2024-11-11T01:01:00Z',
          trail: true,
          sentenceType: 'EPP',
          issp: 'NO',
          hdc: 'YES',
          prarr: 'UNKNOWN',
        }),
        curfewReleaseDateConditions: createCurfewReleaseDateConditions({
          curfewAddress: 'PRIMARY',
          endTime: '11:11:00',
          releaseDate: '2024-11-11T00:00:00Z',
          startTime: '11:11:00',
        }),
        curfewConditions: createCurfewConditions({
          curfewAddress: 'PRIMARY,SECONDARY',
          endDate: '2024-11-11T00:00:00Z',
          startDate: '2024-11-11T00:00:00Z',
        }),
        curfewTimeTable: [
          {
            dayOfWeek: 'MONDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'MONDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'SECONDARY_ADDRESS',
          },
          {
            dayOfWeek: 'TUESDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'WEDNESDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'THURSDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'FRIDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'SATURDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
          {
            dayOfWeek: 'SUNDAY',
            startTime: '11:11:00',
            endTime: '11:11:00',
            curfewAddress: 'PRIMARY_ADDRESS',
          },
        ],
        enforcementZoneConditions: [
          {
            zoneType: 'INCLUSION' as EnforcementZoneTypes,
            startDate: '2024-11-11T00:00:00Z',
            endDate: '2024-12-11T00:00:00Z',
            description: 'Description here',
            duration: 'Duration here',
            fileName: null,
            fileId: null,
            zoneId: 1,
          },
          {
            zoneType: 'EXCLUSION' as EnforcementZoneTypes,
            startDate: '2024-11-11T01:00:00Z',
            endDate: '2024-12-11T00:00:00Z',
            description: 'Description here',
            duration: 'Duration here',
            fileName: 'zone.png',
            fileId: null,
            zoneId: 0,
          },
        ],
        monitoringConditionsTrail: {
          startDate: '2024-11-11T00:00:00Z',
          endDate: '2024-11-11T00:00:00Z',
        },
        mandatoryAttendanceConditions: [
          {
            id: conditionId,
            startDate: '2025-01-01',
            endDate: '2025-01-11',
            purpose: 'test purpose',
            appointmentDay: 'test day',
            startTime: '01:11:00',
            endTime: '11:11:00',
            addressLine1: 'add 1',
            addressLine2: 'add 2',
            addressLine3: 'add 3',
            addressLine4: '',
            postcode: 'PC13DE',
          },
        ],
        monitoringConditionsAlcohol: {
          endDate: '2024-11-11T00:00:00Z',
          installationLocation: 'PRIMARY',
          monitoringType: 'ALCOHOL_LEVEL',
          prisonName: null,
          probationOfficeName: null,
          startDate: '2024-11-11T00:00:00Z',
        },
      })
      const req = createMockRequest({
        order,
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/check-your-answers', {
        monitoringConditions: [
          {
            key: {
              text: 'Start date',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'start date',
                },
              ],
            },
          },
          {
            key: {
              text: 'Start time',
            },
            value: {
              text: '01:01:00',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'start time',
                },
              ],
            },
          },
          {
            key: {
              text: 'End date',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'end date',
                },
              ],
            },
          },
          {
            key: {
              text: 'End time',
            },
            value: {
              text: '01:01:00',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'end time',
                },
              ],
            },
          },
          {
            key: {
              text: 'Order type',
            },
            value: {
              text: 'Pre-Trial',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'order type',
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.orderTypeDescription,
            },
            value: {
              text: 'GPS Acquisitive Crime HDC',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.orderTypeDescription.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: 'Condition type',
            },
            value: {
              text: 'Requirement of a Community Order',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'condition type',
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.sentenceType,
            },
            value: {
              text: 'Section 227/228 Extended Sentence for Public Protection (EPP)',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.sentenceType.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.issp,
            },
            value: {
              text: 'No',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.issp.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.hdc,
            },
            value: {
              text: 'Yes',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.hdc.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: questions.monitoringConditions.prarr,
            },
            value: {
              text: 'Not able to provide this information',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: questions.monitoringConditions.prarr.toLowerCase(),
                },
              ],
            },
          },
          {
            key: {
              text: 'What monitoring does the device wearer need?',
            },
            value: {
              html: 'Curfew<br/>Exlusion zone<br/>Trail<br/>Mandatory attendance<br/>Alcohol',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what monitoring does the device wearer need?',
                },
              ],
            },
          },
        ],
        installationAddress: [
          {
            key: {
              text: 'Address line 1',
            },
            value: {
              text: 'Line 1',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 1',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 2',
            },
            value: {
              text: 'Line 2',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 2',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 3',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 3',
                },
              ],
            },
          },
          {
            key: {
              text: 'Address line 4',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'address line 4',
                },
              ],
            },
          },
          {
            key: {
              text: 'Postcode',
            },
            value: {
              text: 'Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'postcode',
                },
              ],
            },
          },
        ],
        curfew: [
          {
            key: {
              text: 'Release date',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'release date',
                },
              ],
            },
          },
          {
            key: {
              text: 'Curfew hours on the day of release',
            },
            value: {
              text: '11:11:00 - 11:11:00',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'curfew hours on the day of release',
                },
              ],
            },
          },
          {
            key: {
              text: 'Curfew address on the day of release',
            },
            value: {
              html: 'Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'curfew address on the day of release',
                },
              ],
            },
          },
          {
            key: {
              text: 'Date when monitoring starts',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring starts',
                },
              ],
            },
          },
          {
            key: {
              text: 'Date when monitoring ends',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring ends',
                },
              ],
            },
          },
          {
            key: {
              text: 'What address or addresses will the device wearer use during curfew hours?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode<br/>Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what address or addresses will the device wearer use during curfew hours?',
                },
              ],
            },
          },
        ],
        curfewTimetable: [
          {
            key: {
              text: 'Line 1, Line 2, Postcode',
            },
            value: {
              html: 'Monday - 11:11:00-11:11:00<br/>Tuesday - 11:11:00-11:11:00<br/>Wednesday - 11:11:00-11:11:00<br/>Thursday - 11:11:00-11:11:00<br/>Friday - 11:11:00-11:11:00<br/>Saturday - 11:11:00-11:11:00<br/>Sunday - 11:11:00-11:11:00',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'line 1, line 2, postcode',
                },
              ],
            },
          },
          {
            key: {
              text: 'Line 1, Line 2, Postcode',
            },
            value: {
              html: 'Monday - 11:11:00-11:11:00',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'line 1, line 2, postcode',
                },
              ],
            },
          },
        ],
        exclusionZone: [
          {
            key: {
              text: 'Exclusion zone 1',
            },
            value: {
              html: 'zone.png<br/><br/>Description here<br/><br/>Duration here',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'exclusion zone 1',
                },
              ],
            },
          },
          {
            key: {
              text: 'Inclusion zone 2',
            },
            value: {
              html: 'No file selected<br/><br/>Description here<br/><br/>Duration here',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'inclusion zone 2',
                },
              ],
            },
          },
        ],
        trail: [
          {
            key: {
              text: 'Date when monitoring starts',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring starts',
                },
              ],
            },
          },
          {
            key: {
              text: 'Date when monitoring ends',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring ends',
                },
              ],
            },
          },
        ],
        attendance: [
          [
            {
              key: {
                text: 'Date when mandatory attendance monitoring starts',
              },
              value: {
                text: '01/01/2025',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'date when mandatory attendance monitoring starts',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Date when mandatory attendance monitoring ends',
              },
              value: {
                text: '11/01/2025',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'date when mandatory attendance monitoring ends',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What is the appointment for?',
              },
              value: {
                text: 'test purpose',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what is the appointment for?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What day or days is the appointment?',
              },
              value: {
                text: 'test day',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what day or days is the appointment?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Time of the appointment',
              },
              value: {
                text: '01:11:00 - 11:11:00',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'time of the appointment',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Address where the appointment will take place',
              },
              value: {
                text: 'add 1',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'address where the appointment will take place',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Address line 2',
              },
              value: {
                text: 'add 2',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'address line 2',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Town or City',
              },
              value: {
                text: 'add 3',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'town or city',
                  },
                ],
              },
            },
            {
              key: {
                text: 'County',
              },
              value: {
                text: '',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'county',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Postcode',
              },
              value: {
                text: 'PC13DE',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'postcode',
                  },
                ],
              },
            },
          ],
        ],
        alcohol: [
          {
            key: {
              text: 'What type of alcohol monitoring is needed?',
            },
            value: {
              text: 'Alcohol level',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what type of alcohol monitoring is needed?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Date when monitoring starts',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring starts',
                },
              ],
            },
          },
          {
            key: {
              text: 'Date when monitoring ends',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'date when monitoring ends',
                },
              ],
            },
          },
          {
            key: {
              text: 'Where will alcohol monitoring equipment installation take place?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'where will alcohol monitoring equipment installation take place?',
                },
              ],
            },
          },
        ],
      })
    })
  })
})
