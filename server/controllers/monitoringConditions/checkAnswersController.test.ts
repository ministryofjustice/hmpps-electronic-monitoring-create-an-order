import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import {
  createAddress,
  createCurfewConditions,
  createCurfewReleaseDateConditions,
  createMonitoringConditions,
  getMockOrder,
} from '../../../test/mocks/mockOrder'
import paths from '../../constants/paths'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import EnforcementZoneTypes from '../../models/EnforcementZoneTypes'
import AuditService from '../../services/auditService'
import TaskListService from '../../services/taskListService'
import CheckAnswersController from './checkAnswersController'
import config from '../../config'

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
      config.monitoringConditionTimes.enabled = true
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
              text: 'What is the date for the first day of all monitoring?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date for the first day of all monitoring?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the start time on the first day of monitoring?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the start time on the first day of monitoring?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the date when all monitoring ends?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date when all monitoring ends?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the end time on the last day of monitoring? (optional)',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the end time on the last day of monitoring? (optional)',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the order type?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the order type?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What pilot project is the device wearer part of?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what pilot project is the device wearer part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What condition is the monitoring part of?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what condition is the monitoring part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What type of sentence has the device wearer been given?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what type of sentence has the device wearer been given?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'is the device wearer on the intensive supervision and surveillance programme (issp)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on a Home Detention Curfew (HDC)?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'is the device wearer on a home detention curfew (hdc)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
            },
            value: {
              text: '',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'has the device wearer been released on a presumptive risk assessed release review (p-rarr)?',
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
        installationAppointment: [],
        installationLocation: [],
        installationAddress: [],
        curfewReleaseDate: [],
        curfew: [],
        curfewTimetable: [],
        exclusionZone: [],
        trail: [],
        attendance: [],
        alcohol: [],
      })
    })

    it('should render the check answers with all answers completed feature flag is on', async () => {
      // Given
      config.monitoringConditionTimes.enabled = true
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
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
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
          curfewAdditionalDetails: 'some additional curfew details',
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
          monitoringType: 'ALCOHOL_LEVEL',
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
              text: 'What is the date for the first day of all monitoring?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date for the first day of all monitoring?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the start time on the first day of monitoring?',
            },
            value: {
              text: '01:01',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the start time on the first day of monitoring?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the date when all monitoring ends?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date when all monitoring ends?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the end time on the last day of monitoring? (optional)',
            },
            value: {
              text: '01:01',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the end time on the last day of monitoring? (optional)',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the order type?',
            },
            value: {
              text: 'Pre-Trial',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the order type?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What pilot project is the device wearer part of?',
            },
            value: {
              text: 'GPS Acquisitive Crime Home Detention Curfew',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what pilot project is the device wearer part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What condition is the monitoring part of?',
            },
            value: {
              text: 'Licence condition',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what condition is the monitoring part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What type of sentence has the device wearer been given?',
            },
            value: {
              text: 'Section 227/228 Extended Sentence for Public Protection (EPP)',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what type of sentence has the device wearer been given?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
            },
            value: {
              text: 'No',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'is the device wearer on the intensive supervision and surveillance programme (issp)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on a Home Detention Curfew (HDC)?',
            },
            value: {
              text: 'Yes',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'is the device wearer on a home detention curfew (hdc)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
            },
            value: {
              text: 'Not able to provide this information',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'has the device wearer been released on a presumptive risk assessed release review (p-rarr)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What monitoring does the device wearer need?',
            },
            value: {
              html: 'Curfew<br/>Exclusion zone<br/>Trail<br/>Mandatory attendance<br/>Alcohol',
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
        installationAppointment: [],
        installationLocation: [],
        installationAddress: [],
        curfewReleaseDate: [
          {
            key: {
              text: 'What date is the device wearer released from custody?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date is the device wearer released from custody?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day of release, what time does the curfew start?',
            },
            value: {
              text: '11:11',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day of release, what time does the curfew start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day after release, what time does the curfew end?',
            },
            value: {
              text: '11:11',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day after release, what time does the curfew end?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day of release, where will the device wearer be during curfew hours?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day of release, where will the device wearer be during curfew hours?',
                },
              ],
            },
          },
        ],
        curfew: [
          {
            key: {
              text: 'What date does the curfew start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does the curfew start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does the curfew end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does the curfew end?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Where will the device wearer be during curfew hours?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode<br/>Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'where will the device wearer be during curfew hours?',
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
              html: 'Monday - 11:11-11:11<br/>Tuesday - 11:11-11:11<br/>Wednesday - 11:11-11:11<br/>Thursday - 11:11-11:11<br/>Friday - 11:11-11:11<br/>Saturday - 11:11-11:11<br/>Sunday - 11:11-11:11',
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
              html: 'Monday - 11:11-11:11',
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
          [
            {
              key: {
                text: 'What date does exclusion zone monitoring start?',
              },
              value: {
                text: '11/11/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does exclusion zone monitoring end?',
              },
              value: {
                text: '11/12/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Where is the exclusion zone?',
              },
              value: {
                text: 'Description here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'where is the exclusion zone?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'When must the exclusion zone be followed?',
              },
              value: {
                text: 'Duration here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'when must the exclusion zone be followed?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Monitoring zone map (optional)',
              },
              value: {
                text: 'zone.png',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'monitoring zone map (optional)',
                  },
                ],
              },
            },
          ],
          [
            {
              key: {
                text: 'What date does exclusion zone monitoring start?',
              },
              value: {
                text: '11/11/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does exclusion zone monitoring end?',
              },
              value: {
                text: '11/12/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Where is the exclusion zone?',
              },
              value: {
                text: 'Description here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'where is the exclusion zone?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'When must the exclusion zone be followed?',
              },
              value: {
                text: 'Duration here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'when must the exclusion zone be followed?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Monitoring zone map (optional)',
              },
              value: {
                text: 'No file selected',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'monitoring zone map (optional)',
                  },
                ],
              },
            },
          ],
        ],
        trail: [
          {
            key: {
              text: 'What date does trail monitoring start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does trail monitoring start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does trail monitoring end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does trail monitoring end?',
                },
              ],
            },
          },
        ],
        attendance: [
          [
            {
              key: {
                text: 'What date does mandatory attendance monitoring start?',
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
                    visuallyHiddenText: 'what date does mandatory attendance monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does mandatory attendance monitoring end?',
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
                    visuallyHiddenText: 'what date does mandatory attendance monitoring end?',
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
                text: 'On what day is the appointment and how frequently does the appointment take place?',
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
                    visuallyHiddenText:
                      'on what day is the appointment and how frequently does the appointment take place?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What time does the appointment start?',
              },
              value: {
                text: '01:11',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what time does the appointment start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What time does the appointment end?',
              },
              value: {
                text: '11:11',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what time does the appointment end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'At what address will the appointment take place?',
              },
              value: {
                html: 'add 1, add 2, PC13DE',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'at what address will the appointment take place?',
                  },
                ],
              },
            },
          ],
        ],
        alcohol: [
          {
            key: {
              text: 'What alcohol monitoring does the device wearer need?',
            },
            value: {
              text: 'Alcohol level',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what alcohol monitoring does the device wearer need?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does alcohol monitoring start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does alcohol monitoring start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does alcohol monitoring end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does alcohol monitoring end?',
                },
              ],
            },
          },
        ],
      })
    })

    it('should render the check answers with all answers completed feature flag is off', async () => {
      // Given
      config.monitoringConditionTimes.enabled = false
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
          conditionType: 'LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER',
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
          curfewAdditionalDetails: 'some additional curfew details',
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
          monitoringType: 'ALCOHOL_LEVEL',
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
              text: 'What is the date for the first day of all monitoring?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date for the first day of all monitoring?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the date when all monitoring ends?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the date when all monitoring ends?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What is the order type?',
            },
            value: {
              text: 'Pre-Trial',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what is the order type?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What pilot project is the device wearer part of?',
            },
            value: {
              text: 'GPS Acquisitive Crime Home Detention Curfew',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what pilot project is the device wearer part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What condition is the monitoring part of?',
            },
            value: {
              text: 'Licence condition',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what condition is the monitoring part of?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What type of sentence has the device wearer been given?',
            },
            value: {
              text: 'Section 227/228 Extended Sentence for Public Protection (EPP)',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what type of sentence has the device wearer been given?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
            },
            value: {
              text: 'No',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'is the device wearer on the intensive supervision and surveillance programme (issp)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Is the device wearer on a Home Detention Curfew (HDC)?',
            },
            value: {
              text: 'Yes',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'is the device wearer on a home detention curfew (hdc)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
            },
            value: {
              text: 'Not able to provide this information',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText:
                    'has the device wearer been released on a presumptive risk assessed release review (p-rarr)?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What monitoring does the device wearer need?',
            },
            value: {
              html: 'Curfew<br/>Exclusion zone<br/>Trail<br/>Mandatory attendance<br/>Alcohol',
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
        installationAppointment: [],
        installationLocation: [],
        installationAddress: [],
        curfewReleaseDate: [
          {
            key: {
              text: 'What date is the device wearer released from custody?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date is the device wearer released from custody?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day of release, what time does the curfew start?',
            },
            value: {
              text: '11:11',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day of release, what time does the curfew start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day after release, what time does the curfew end?',
            },
            value: {
              text: '11:11',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day after release, what time does the curfew end?',
                },
              ],
            },
          },
          {
            key: {
              text: 'On the day of release, where will the device wearer be during curfew hours?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'on the day of release, where will the device wearer be during curfew hours?',
                },
              ],
            },
          },
        ],
        curfew: [
          {
            key: {
              text: 'What date does the curfew start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does the curfew start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does the curfew end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does the curfew end?',
                },
              ],
            },
          },
          {
            key: {
              text: 'Where will the device wearer be during curfew hours?',
            },
            value: {
              html: 'Line 1, Line 2, Postcode<br/>Line 1, Line 2, Postcode',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'where will the device wearer be during curfew hours?',
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
              html: 'Monday - 11:11-11:11<br/>Tuesday - 11:11-11:11<br/>Wednesday - 11:11-11:11<br/>Thursday - 11:11-11:11<br/>Friday - 11:11-11:11<br/>Saturday - 11:11-11:11<br/>Sunday - 11:11-11:11',
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
              html: 'Monday - 11:11-11:11',
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
          [
            {
              key: {
                text: 'What date does exclusion zone monitoring start?',
              },
              value: {
                text: '11/11/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does exclusion zone monitoring end?',
              },
              value: {
                text: '11/12/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Where is the exclusion zone?',
              },
              value: {
                text: 'Description here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'where is the exclusion zone?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'When must the exclusion zone be followed?',
              },
              value: {
                text: 'Duration here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'when must the exclusion zone be followed?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Monitoring zone map (optional)',
              },
              value: {
                text: 'zone.png',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'monitoring zone map (optional)',
                  },
                ],
              },
            },
          ],
          [
            {
              key: {
                text: 'What date does exclusion zone monitoring start?',
              },
              value: {
                text: '11/11/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does exclusion zone monitoring end?',
              },
              value: {
                text: '11/12/2024',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'what date does exclusion zone monitoring end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Where is the exclusion zone?',
              },
              value: {
                text: 'Description here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'where is the exclusion zone?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'When must the exclusion zone be followed?',
              },
              value: {
                text: 'Duration here',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'when must the exclusion zone be followed?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'Monitoring zone map (optional)',
              },
              value: {
                text: 'No file selected',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '1').replace(':orderId', order.id),
                    text: 'Change',
                    visuallyHiddenText: 'monitoring zone map (optional)',
                  },
                ],
              },
            },
          ],
        ],
        trail: [
          {
            key: {
              text: 'What date does trail monitoring start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does trail monitoring start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does trail monitoring end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does trail monitoring end?',
                },
              ],
            },
          },
        ],
        attendance: [
          [
            {
              key: {
                text: 'What date does mandatory attendance monitoring start?',
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
                    visuallyHiddenText: 'what date does mandatory attendance monitoring start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What date does mandatory attendance monitoring end?',
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
                    visuallyHiddenText: 'what date does mandatory attendance monitoring end?',
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
                text: 'On what day is the appointment and how frequently does the appointment take place?',
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
                    visuallyHiddenText:
                      'on what day is the appointment and how frequently does the appointment take place?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What time does the appointment start?',
              },
              value: {
                text: '01:11',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what time does the appointment start?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'What time does the appointment end?',
              },
              value: {
                text: '11:11',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'what time does the appointment end?',
                  },
                ],
              },
            },
            {
              key: {
                text: 'At what address will the appointment take place?',
              },
              value: {
                html: 'add 1, add 2, PC13DE',
              },
              actions: {
                items: [
                  {
                    href: paths.MONITORING_CONDITIONS.ATTENDANCE_ITEM.replace(`:orderId`, order.id).replace(
                      `:conditionId`,
                      conditionId,
                    ),
                    text: 'Change',
                    visuallyHiddenText: 'at what address will the appointment take place?',
                  },
                ],
              },
            },
          ],
        ],
        alcohol: [
          {
            key: {
              text: 'What alcohol monitoring does the device wearer need?',
            },
            value: {
              text: 'Alcohol level',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what alcohol monitoring does the device wearer need?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does alcohol monitoring start?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does alcohol monitoring start?',
                },
              ],
            },
          },
          {
            key: {
              text: 'What date does alcohol monitoring end?',
            },
            value: {
              text: '11/11/2024',
            },
            actions: {
              items: [
                {
                  href: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
                  text: 'Change',
                  visuallyHiddenText: 'what date does alcohol monitoring end?',
                },
              ],
            },
          },
        ],
      })
    })
  })
})
