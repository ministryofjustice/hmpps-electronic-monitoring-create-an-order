import type { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import RestClient from '../../data/restClient'
import AuditService from '../../services/auditService'
import CurfewTimetableService from '../../services/curfewTimetableService'
import CurfewTimetableController from './curfewTimetableController'
import paths from '../../constants/paths'

jest.mock('../../services/auditService')
jest.mock('../../data/hmppsAuditClient')
jest.mock('../../data/restClient')

const mockId = uuidv4()

describe('CurfewTimetableController', () => {
  let mockAuditClient: jest.Mocked<HmppsAuditClient>
  let mockAuditService: jest.Mocked<AuditService>

  let mockCurfewTimetablService: jest.Mocked<CurfewTimetableService>
  let controller: CurfewTimetableController
  let req: Request
  let res: Response
  let next: NextFunction
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  beforeEach(() => {
    mockAuditClient = new HmppsAuditClient({
      queueUrl: '',
      enabled: true,
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    const mockRestClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    mockAuditService = new AuditService(mockAuditClient) as jest.Mocked<AuditService>
    mockCurfewTimetablService = new CurfewTimetableService(mockRestClient) as jest.Mocked<CurfewTimetableService>
    controller = new CurfewTimetableController(mockAuditService, mockCurfewTimetablService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {
        orderId: mockId,
      },
      order: getMockOrder({ id: mockId }),
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
      flash: jest.fn(),
    }

    // @ts-expect-error stubbing res.render
    res = {
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
        editable: false,
        orderId: mockId,
      },
      redirect: jest.fn(),
      render: jest.fn(),
    }

    next = jest.fn()
  })

  describe('View curefew timetable', () => {
    it('Shoud render with validationErrors, if flash exist', async () => {
      const validationErrors = days.map(day => {
        return {
          dayOfWeek: day.toUpperCase(),
          startTime: '19:00:00',
          endTime: '23:59:00',
          curfewAddress: 'PRIMARY_ADDRESS',
          errors: [{ field: 'curfewAddress', error: ['mockError'] }],
        }
      })
      req.flash = jest.fn().mockReturnValueOnce(validationErrors)
      // When
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-timetable', {
        curfewTimetable: {
          monday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          tuesday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          wednesday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          thursday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          friday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          saturday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
          sunday: [
            {
              timeSpan: {
                value: {
                  startHours: '19',
                  startMinutes: '00',
                  endHours: '23',
                  endMinutes: '59',
                },
              },
              addresses: {
                values: ['PRIMARY_ADDRESS'],
                error: {
                  text: ['mockError'],
                },
              },
            },
          ],
        },
      })
    })

    it('Shoud render with formData, if flash exist', async () => {
      const formData: { curfewTimetable: { [k: string]: [object] } } = { curfewTimetable: {} }
      days.forEach(day => {
        formData.curfewTimetable[day] = [
          {
            timeStartHours: '18',
            timeStartMinutes: '00',
            timeEndHours: '22',
            timeEndMinutes: '00',
            addresses: ['PRIMARY_ADDRESS'],
          },
        ]
      })

      req.flash = jest.fn().mockReturnValueOnce([]).mockReturnValueOnce([formData])
      // When
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-timetable', {
        curfewTimetable: {
          monday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          tuesday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          wednesday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          thursday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          friday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          saturday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
          sunday: [
            {
              timeSpan: {
                value: {
                  startHours: '18',
                  startMinutes: '00',
                  endHours: '22',
                  endMinutes: '00',
                },
              },
              addresses: { values: ['PRIMARY_ADDRESS'] },
            },
          ],
        },
      })
    })

    it('Should render with existing curfew timetable', async () => {
      const timetable = days.map(day => {
        return {
          dayOfWeek: day.toUpperCase(),
          startTime: '00:00:00',
          endTime: '07:00:00',
          orderId: mockId,
          curfewAddress: 'SECONDARY_ADDRESS',
        }
      })
      req.order = getMockOrder({ id: mockId, curfewTimeTable: timetable })
      // When
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-timetable', {
        curfewTimetable: {
          monday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          tuesday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          wednesday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          thursday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          friday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          saturday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
          sunday: [
            {
              timeSpan: {
                value: {
                  startHours: '00',
                  startMinutes: '00',
                  endHours: '07',
                  endMinutes: '00',
                },
              },
              addresses: {
                values: ['SECONDARY_ADDRESS'],
              },
            },
          ],
        },
      })
    })

    it('Should render with default timetable', async () => {
      req.order = getMockOrder({ id: mockId, curfewTimeTable: [] })
      // When
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/monitoring-conditions/curfew-timetable', {
        curfewTimetable: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
      })
    })
  })

  describe('Update curfew timetable', () => {
    it('Should redirect view with added timetable, when action is prefixed with add-time-', async () => {
      const formData: { curfewTimetable: { [k: string]: [object] }; action: string } = {
        action: 'add-time-monday',
        curfewTimetable: {},
      }
      days.forEach(day => {
        formData.curfewTimetable[day] = [
          {
            timeStartHours: '',
            timeStartMinutes: '',
            timeEndHours: '',
            timeEndMinutes: '',
            addresses: [],
          },
        ]
      })
      req.body = formData
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('formData', {
        action: 'add-time-monday',
        curfewTimetable: {
          monday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          tuesday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          wednesday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          thursday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          friday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          saturday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
          sunday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: [],
            },
          ],
        },
      })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', mockId),
      )
    })

    it('Should redirect view with timetable removed, when action is prefixed with remove-time-', async () => {
      const formData: { curfewTimetable: { [k: string]: [object] }; action: string } = {
        action: 'remove-time-monday-0',
        curfewTimetable: {},
      }
      days.forEach(day => {
        formData.curfewTimetable[day] = [
          {
            timeStartHours: '',
            timeStartMinutes: '',
            timeEndHours: '',
            timeEndMinutes: '',
            addresses: ['PRIMARY_ADDRESS'],
          },
        ]
        if (day === 'monday') {
          formData.curfewTimetable[day].push({
            timeStartHours: '',
            timeStartMinutes: '',
            timeEndHours: '',
            timeEndMinutes: '',
            addresses: ['SECONDARY_ADDRESS'],
          })
        }
      })
      req.body = formData
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('formData', {
        action: 'remove-time-monday-0',
        curfewTimetable: {
          monday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['SECONDARY_ADDRESS'],
            },
          ],
          tuesday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
          wednesday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
          thursday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
          friday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
          saturday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
          sunday: [
            {
              timeStartHours: '',
              timeStartMinutes: '',
              timeEndHours: '',
              timeEndMinutes: '',
              addresses: ['PRIMARY_ADDRESS'],
            },
          ],
        },
      })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', mockId),
      )
    })

    it('Should redirect view with validation error, when service return validation error', async () => {
      const formData: { curfewTimetable: { [k: string]: [object] }; action: string } = {
        action: '',
        curfewTimetable: {},
      }
      days.forEach(day => {
        formData.curfewTimetable[day] = [
          {
            timeStartHours: '19',
            timeStartMinutes: '00',
            timeEndHours: '23',
            timeEndMinutes: '59',
            addresses: ['PRIMARY_ADDRESS'],
          },
        ]
      })
      req.body = formData

      mockCurfewTimetablService.update = jest.fn().mockReturnValueOnce([
        { index: 0, errors: [{ field: 'startTime', error: 'Mock Start Time Error' }] },
        { index: 3, errors: [{ field: 'curfewAddress', error: 'Mock Address Error' }] },
      ])
      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          dayOfWeek: 'MONDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [
            {
              field: 'startTime',
              error: 'Mock Start Time Error',
            },
          ],
        },
        {
          dayOfWeek: 'TUESDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [],
        },
        {
          dayOfWeek: 'WEDNESDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [],
        },
        {
          dayOfWeek: 'THURSDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [
            {
              field: 'curfewAddress',
              error: 'Mock Address Error',
            },
          ],
        },
        {
          dayOfWeek: 'FRIDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [],
        },
        {
          dayOfWeek: 'SATURDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [],
        },
        {
          dayOfWeek: 'SUNDAY',
          orderId: mockId,
          curfewAddress: 'PRIMARY_ADDRESS',
          startTime: '19:00:00',
          endTime: '23:59:00',
          errors: [],
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', mockId),
      )
    })

    it('Shoud redirect to next page', async () => {
      const formData: { curfewTimetable: { [k: string]: [object] }; action: string } = {
        action: '',
        curfewTimetable: {},
      }
      days.forEach(day => {
        formData.curfewTimetable[day] = [
          {
            timeStartHours: '19',
            timeStartMinutes: '00',
            timeEndHours: '23',
            timeEndMinutes: '59',
            addresses: ['PRIMARY_ADDRESS'],
          },
        ]
      })
      req.body = formData

      mockCurfewTimetablService.update = jest.fn().mockReturnValueOnce([{ dayOfWeek: 'Monday' }])

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', mockId))
    })
  })
})
