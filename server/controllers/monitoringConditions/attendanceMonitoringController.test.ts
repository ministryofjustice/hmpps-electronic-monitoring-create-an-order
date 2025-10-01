import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import AttendanceMonitoringController from './attendanceMonitoringController'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import RestClient from '../../data/restClient'
import AttendanceMonitoringService from '../../services/attendanceMonitoringService'
import TaskListService from '../../services/taskListService'
import OrderChecklistService from '../../services/orderChecklistService'

const mockConditionId = uuidv4()

jest.mock('../../services/auditService')
jest.mock('../../services/orderService')
jest.mock('../../services/attendanceMonitoringService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

describe('attendanceMonitoringController', () => {
  let mockRestClient: jest.Mocked<RestClient>
  let mockAttendanceMonitoringService: jest.Mocked<AttendanceMonitoringService>
  let attendanceMonitoringController: AttendanceMonitoringController
  const mockOrderChecklistService = {
    setSectionCheckStatus: jest.fn(),
  } as unknown as jest.Mocked<OrderChecklistService>
  const taskListService = new TaskListService(mockOrderChecklistService)

  beforeEach(() => {
    mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>

    mockAttendanceMonitoringService = new AttendanceMonitoringService(
      mockRestClient,
    ) as jest.Mocked<AttendanceMonitoringService>

    attendanceMonitoringController = new AttendanceMonitoringController(
      mockAttendanceMonitoringService,
      taskListService,
    )
  })

  const validMock = [
    {
      id: mockConditionId,
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
  ]

  const invalidMock = [
    {
      id: mockConditionId,
      startDate: '',
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
      addAnother: 'true',
    },
  ]

  const invalidBody = {
    action: 'continue',
    startDate: {
      day: '',
      month: '',
      year: '',
      hours: '00',
      minutes: '00',
    },
    endDate: {
      day: '11',
      month: '06',
      year: '2025',
      hours: '23',
      minutes: '59',
    },
    purpose: 'test purpose',
    appointmentDay: 'test day',
    startTimeMinutes: '11',
    startTimeHours: '1',
    endTimeMinutes: '11',
    endTimeHours: '11',
    addressLine1: 'add 1',
    addressLine2: 'add 2',
    addressLine3: 'add 3',
    addressLine4: '',
    postcode: 'PC13DE',
    addAnother: 'false',
  }

  const validBody = {
    action: 'continue',
    startDate: {
      day: '01',
      month: '01',
      year: '2025',
      hours: '00',
      minutes: '00',
    },
    endDate: {
      day: '11',
      month: '01',
      year: '2025',
      hours: '23',
      minutes: '59',
    },
    purpose: 'test purpose',
    appointmentDay: 'test day',
    startTimeMinutes: '11',
    startTimeHours: '1',
    endTimeMinutes: '11',
    endTimeHours: '11',
    addressLine1: 'add 1',
    addressLine2: 'add 2',
    addressLine3: 'add 3',
    addressLine4: '',
    postcode: 'PC13DE',
    addAnother: 'false',
  }

  describe('get', () => {
    it('should render the form when there are no saved attendance monitoring', async () => {
      // Given
      const mockOrder = getMockOrder({ mandatoryAttendanceConditions: [] })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await attendanceMonitoringController.new(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalled()
    })

    it('should render the form with fields filled when provided a valid conditionId', async () => {
      // Given
      const mockOrder = getMockOrder({ mandatoryAttendanceConditions: validMock })
      const req = createMockRequest({ order: mockOrder, flash: jest.fn().mockReturnValue([]) })
      req.params.conditionId = mockConditionId
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await attendanceMonitoringController.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/attendance-monitoring', {
        addressLine1: { value: 'add 1' },
        addressLine2: { value: 'add 2' },
        addressLine3: { value: 'add 3' },
        addressLine4: { value: '' },
        postcode: { value: 'PC13DE' },
        appointmentDay: { value: 'test day' },
        endDate: {
          value: {
            day: '11',
            month: '01',
            year: '2025',
            hours: '00',
            minutes: '00',
          },
        },
        endTime: { value: { hours: '11', minutes: '11' } },
        purpose: { value: 'test purpose' },
        startDate: {
          value: {
            day: '01',
            month: '01',
            year: '2025',
            hours: '00',
            minutes: '00',
          },
        },
        startTime: { value: { hours: '01', minutes: '11' } },
        errorSummary: null,
      })
    })

    it('should render the form using submitted data when there are validation errors', async () => {
      // Given
      const mockOrder = getMockOrder({ mandatoryAttendanceConditions: invalidMock })
      const req = createMockRequest({
        order: mockOrder,
        flash: jest
          .fn()
          .mockReturnValueOnce([
            {
              error: 'Please enter a mandatory attendance monitoring start date date to continue to the next page',
              field: 'startDate',
            },
          ])
          .mockReturnValueOnce([
            {
              addressLine1: '',
              addressLine2: '',
              addressLine3: '',
              addressLine4: '',
              postcode: '',
              appointmentDay: '',
              startDate: {
                day: '',
                month: '',
                year: '',
                hours: '',
                minutes: '',
              },
              endDate: {
                day: '',
                month: '',
                year: '',
                hours: '',
                minutes: '',
              },
              endTimeHours: '',
              endTimeMinutes: '',
              purpose: '',
              startTimeHours: '',
              startTimeMinutes: '',
              addAnother: '',
            },
          ]),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await attendanceMonitoringController.new(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/attendance-monitoring', {
        id: undefined,
        addressLine1: {
          error: undefined,
          value: '',
        },
        addressLine2: {
          error: undefined,
          value: '',
        },
        addressLine3: {
          error: undefined,
          value: '',
        },
        addressLine4: {
          error: undefined,
          value: '',
        },
        postcode: {
          error: undefined,
          value: '',
        },
        appointmentDay: {
          error: undefined,
          value: '',
        },
        endDate: {
          error: undefined,
          value: {
            day: '',
            month: '',
            year: '',
            hours: '',
            minutes: '',
          },
        },
        endTime: {
          error: undefined,
          value: {
            hours: '',
            minutes: '',
          },
        },
        purpose: {
          error: undefined,
          value: '',
        },
        startDate: {
          value: {
            day: '',
            month: '',
            year: '',
            hours: '',
            minutes: '',
          },
          error: {
            text: 'Please enter a mandatory attendance monitoring start date date to continue to the next page',
          },
        },
        startTime: {
          error: undefined,
          value: {
            hours: '',
            minutes: '',
          },
        },
        addAnother: {
          error: undefined,
          value: '',
        },
        errorSummary: {
          errorList: [
            {
              href: '#startDate',
              text: 'Please enter a mandatory attendance monitoring start date date to continue to the next page',
            },
          ],
          titleText: 'There is a problem',
        },
      })
    })
  })

  describe('post', () => {
    it('should persist data and redirect to the form when the user submits invalid values', async () => {
      const mockOrder = getMockOrder()

      const req = createMockRequest({
        order: mockOrder,
        body: invalidBody,
        params: { orderId: mockOrder.id },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()

      mockAttendanceMonitoringService.update.mockResolvedValue([
        {
          error: 'Please enter a mandatory attendance monitoring start date date to continue to the next page',
          field: 'startDate',
        },
      ])

      // When
      await attendanceMonitoringController.update(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledTimes(2)
      expect(req.flash).toHaveBeenNthCalledWith(1, 'formData', { ...invalidBody, id: null })
      expect(req.flash).toHaveBeenNthCalledWith(2, 'validationErrors', [
        {
          error: 'Please enter a mandatory attendance monitoring start date date to continue to the next page',
          field: 'startDate',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/monitoring-conditions/attendance`)
    })

    it('should save and redirect to the check your answers page if the user selects continue', async () => {
      // Given
      const mockOrder = getMockOrder()

      const req = createMockRequest({
        order: mockOrder,
        body: validBody,
        params: { orderId: mockOrder.id },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await attendanceMonitoringController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/monitoring-conditions/check-your-answers`)
    })

    it('should save and redirect to the form when the user selects yes to additional appointments', async () => {
      // Given
      const mockOrder = getMockOrder()
      const mockBody = validBody
      mockBody.addAnother = 'true'

      const req = createMockRequest({
        order: mockOrder,
        body: validBody,
        params: { orderId: mockOrder.id },
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const next = jest.fn()

      // When
      await attendanceMonitoringController.update(req, res, next)

      // Then
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${mockOrder.id}/monitoring-conditions/attendance`)
    })
  })
})
