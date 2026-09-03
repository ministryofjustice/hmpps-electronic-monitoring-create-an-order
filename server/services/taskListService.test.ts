import {
  createDeviceWearer,
  createMonitoringConditions,
  getFilledMockOrder,
  getMockOrder,
} from '../../test/mocks/mockOrder'
import paths from '../constants/paths'
import TaskListService, { Page, Task } from './taskListService'
import { Order } from '../models/Order'

describe('TaskListService', () => {
  const monitoringConditionsPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE
  describe('getNextPage', () => {
    it('should return contact details if current page is device wearer and adultAtTheTimeOfInstallation is true', () => {
      // Given
      const currentPage = 'DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ adultAtTimeOfInstallation: true }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id))
    })

    it('should return responsible adult if current page is device wearer and adultAtTheTimeOfInstallation is false', () => {
      // Given
      const currentPage = 'DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ adultAtTimeOfInstallation: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id))
    })

    it('should return contact details if current page is responsible adult', () => {
      // Given
      const currentPage = 'RESPONSIBLE_ADULT'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id))
    })

    it('should return device wearer page if current page is identity numbers', () => {
      // Given
      const currentPage = 'IDENTITY_NUMBERS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id))
    })

    it('should go to installation and risk page if current page is device wearer check your answers', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id))
    })

    it('should return no fixed abode if current page is contact details', () => {
      // Given
      const currentPage = 'CONTACT_DETAILS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id))
    })

    it('should go to device wearer cya if current page is no fixed abode and noFixedAbode is true', () => {
      // Given
      const currentPage = 'NO_FIXED_ABODE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: true }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return find address if current page is no fixed abode and noFixedAbode is false', () => {
      // Given
      const currentPage = 'NO_FIXED_ABODE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':addressType', 'PRIMARY').replace(':orderId', order.id),
      )
    })

    it('should return device wearer cya if current page is primary address', () => {
      // Given
      const currentPage = 'PRIMARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return identity numbers if current page is interested parties cya', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_INTERESTED_PARTIES'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id))
    })

    it('should return check answers if current page is installation and risk', () => {
      // Given
      const currentPage = 'INSTALLATION_AND_RISK'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return monitoring conditions if current page is installation and risk check answers', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_INSTALLATION_AND_RISK'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(monitoringConditionsPath.replace(':orderId', order.id))
    })

    it('should return installation appointment if current page is installation location and location is PRISON', () => {
      // Given
      const currentPage = 'INSTALLATION_LOCATION'
      const taskListService = new TaskListService()
      const order = getMockOrder({ installationLocation: { location: 'PRISON' } })
      order.monitoringConditions.alcohol = true
      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT.replace(':orderId', order.id))
    })

    it('should return installation appointment if current page is installation location and location is PROBATION_OFFICE', () => {
      // Given
      const currentPage = 'INSTALLATION_LOCATION'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        installationLocation: { location: 'PROBATION_OFFICE' },
      })
      order.monitoringConditions.alcohol = true
      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.INSTALLATION_APPOINTMENT.replace(':orderId', order.id))
    })

    it('should return find installation address if current page is installation appointment', () => {
      // Given
      const currentPage = 'INSTALLATION_APPOINTMENT'
      const taskListService = new TaskListService()
      const order = getMockOrder({ installationLocation: { location: 'PRISON' } })
      order.monitoringConditions.alcohol = true

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':addressType', 'INSTALLATION').replace(':orderId', order.id),
      )
    })

    it('should return check your answers page if current page is installation address and alcohol was selected', () => {
      // Given
      const currentPage = 'INSTALLATION_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return curfew timetable if current page is curfew day of release', () => {
      // Given
      const currentPage = 'CURFEW_DAY_OF_RELEASE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id))
    })

    it('should return curfew day of release if current page is curfew conitions', () => {
      // Given
      const currentPage = 'CURFEW_CONDITIONS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE.replace(':orderId', order.id))
    })

    // skipped test as currently the additonal details page is disabled
    it.skip('should return curfew timetable if current page is curfew additional details', () => {
      // Given
      const currentPage = 'CURFEW_ADDITIONAL_DETAILS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id))
    })

    it('should return exclusion zone if current page is curfew timetable and exclusionZone is selected', () => {
      // Given
      const currentPage = 'CURFEW_TIMETABLE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
          exclusionZone: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(
        paths.MONITORING_CONDITIONS.ZONE_NEW_ITEM.replace(':zoneId', '0')
          .replace(':orderId', order.id)
          .replace(':zoneType', 'exclusion'),
      )
    })

    it('should return trail monitoring if current page is curfew timetable and trail is selected', () => {
      // Given
      const currentPage = 'CURFEW_TIMETABLE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
          trail: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id))
    })

    it('should return attendance monitoring if current page is curfew timetable and mandatoryAttendance is selected', () => {
      // Given
      const currentPage = 'CURFEW_TIMETABLE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is curfew timetable and alcohol is selected', () => {
      // Given
      const currentPage = 'CURFEW_TIMETABLE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is curfew timetable and no other monitoring is selected', () => {
      // Given
      const currentPage = 'CURFEW_TIMETABLE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return trail monitoring if current page is exclusion zone and trail is selected', () => {
      // Given
      const currentPage = 'ENFORCEMENT_ZONE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
          trail: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id))
    })

    it('should return attendance monitoring if current page is exclusion zone and mandatoryAttendance is selected', () => {
      // Given
      const currentPage = 'ENFORCEMENT_ZONE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is exclusion zone and alcohol is selected', () => {
      // Given
      const currentPage = 'ENFORCEMENT_ZONE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is exclusion zone and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ENFORCEMENT_ZONE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return attendance monitoring if current page is trail monitoring and mandatoryAttendance is selected', () => {
      // Given
      const currentPage = 'TRAIL_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          trail: true,
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is trail monitoring and alcohol is selected', () => {
      // Given
      const currentPage = 'TRAIL_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          trail: true,
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is trail monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'TRAIL_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          trail: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is attendance monitoring and alcohol monitoring is selected', () => {
      // Given
      const currentPage = 'ATTENDANCE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is attendance monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ATTENDANCE_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is alcohol monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ALCOHOL_MONITORING'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return attachments if current page is check your answers', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_MONITORING_CONDITIONS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(
        paths.ATTACHMENT.FILE_VIEW.replace(':orderId', order.id).replace(
          ':fileType(photo_Id|licence|court_order)',
          'licence',
        ),
      )
    })

    it.each([
      ['DEVICE_WEARER', paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS],
      ['INSTALLATION_AND_RISK', paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS],
      ['MONITORING_CONDITIONS', paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS],
    ])(
      'should return check your answers if all pages have been completed for that section',
      (page: string, url: string) => {
        // Given
        const currentPage = page as Page
        const taskListService = new TaskListService()
        const order = getFilledMockOrder({
          monitoringConditions: createMonitoringConditions({
            isValid: true,
          }),
        })

        // When
        const nextPage = taskListService.getNextPage(currentPage, order)

        // Then
        expect(nextPage).toBe(url.replace(':orderId', order.id))
      },
    )
  })

  describe('getNextCheckYourAnswersPage', () => {
    let order: Order
    beforeAll(() => {
      order = getMockOrder({
        status: 'SUBMITTED',
        deviceWearer: createDeviceWearer({
          firstName: '',
          adultAtTimeOfInstallation: false,
          noFixedAbode: false,
        }),
        monitoringConditions: createMonitoringConditions({
          curfew: true,
          alcohol: true,
          exclusionZone: true,
          trail: true,
          mandatoryAttendance: true,
        }),
      })
    })

    it('returns installation and risk CYA if current page is device wearer CYA', () => {
      const taskListService = new TaskListService()

      const nextPage = taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_DEVICE_WEARER', order)

      expect(nextPage).toBe(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('returns monitoring conditions CYA if current page is risk information CYA', () => {
      const taskListService = new TaskListService()

      const nextPage = taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_INSTALLATION_AND_RISK', order)

      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('returns the summary page if current page is last CYA page', () => {
      const taskListService = new TaskListService()

      const nextPage = taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_MONITORING_CONDITIONS', order)

      expect(nextPage).toBe(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    })
  })

  describe('getCheckYourAnswerPathForSection', () => {
    it('extracts the correct link when check your answers is the only task', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'RISK_INFORMATION',
        name: 'CHECK_ANSWERS_INSTALLATION_AND_RISK',
        path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
        state: 'HIDDEN',
        completed: true,
      })

      const taskListService = new TaskListService()

      const result = taskListService.getCheckYourAnswersPathForSection(tasks)

      expect(result).toBe(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS)
    })

    it('extracts the correct link when sections contains multiple tasks', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'RISK_INFORMATION',
        name: 'CHECK_ANSWERS_INSTALLATION_AND_RISK',
        path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS,
        state: 'HIDDEN',
        completed: true,
      })
      tasks.push({
        section: 'RISK_INFORMATION',
        name: 'INSTALLATION_AND_RISK',
        path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK,
        state: 'REQUIRED',
        completed: true,
      })

      const taskListService = new TaskListService()

      const result = taskListService.getCheckYourAnswersPathForSection(tasks)

      expect(result).toBe(paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS)
    })

    it('defaults to first link if there is on check your answers page', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'RISK_INFORMATION',
        name: 'INSTALLATION_AND_RISK',
        path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK,
        state: 'REQUIRED',
        completed: true,
      })

      const taskListService = new TaskListService()

      const result = taskListService.getCheckYourAnswersPathForSection(tasks)

      expect(result).toBe(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK)
    })
  })

  describe('get next task path', () => {
    it('returns the first completable path', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        name: 'INTERESTED_PARTIES',
        path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
        state: 'REQUIRED',
        completed: true,
      })

      tasks.push({
        section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        name: 'INTERESTED_PARTIES',
        path: paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER,
        state: 'REQUIRED',
        completed: false,
      })

      const taskListService = new TaskListService()

      const result = taskListService.getNextTaskPath(tasks, 'mockOrderId')

      expect(result).toBe(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', 'mockOrderId'))
    })

    it('returns the versioned path if version id is provided', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        name: 'INTERESTED_PARTIES',
        path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
        state: 'REQUIRED',
        completed: true,
      })

      const taskListService = new TaskListService()

      const mockOrderId = 'mockOrderId'
      const mockVersionId = 'mockVersionId'
      const result = taskListService.getNextTaskPath(tasks, mockOrderId, mockVersionId)

      expect(result).toBe(
        paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', mockOrderId).replace(
          `order/${mockOrderId}`,
          `order/${mockOrderId}/version/${mockVersionId}`,
        ),
      )
    })

    it('defaults to first task if all tasks are not required', () => {
      const tasks: Task[] = []
      tasks.push({
        section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        name: 'INTERESTED_PARTIES',
        path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
        state: 'NOT_REQUIRED',
        completed: true,
      })

      tasks.push({
        section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        name: 'INTERESTED_PARTIES',
        path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
        state: 'NOT_REQUIRED',
        completed: true,
      })

      const taskListService = new TaskListService()

      const mockOrderId = 'mockOrderId'
      const result = taskListService.getNextTaskPath(tasks, mockOrderId)

      expect(result).toBe(paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION.replace(':orderId', mockOrderId))
    })
  })

  describe('getTasks', () => {
    it('links the curfew release day task to the curfew day of release question page', () => {
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({ curfew: true }),
      })

      const tasks = taskListService.getTasks(order)

      expect(tasks.map(task => task.path)).toContain(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE)
    })
  })
})
