import {
  createAddress,
  createContactDetails,
  createCurfewConditions,
  createCurfewReleaseDateConditions,
  createCurfewTimeTable,
  createDeviceWearer,
  createEnforcementZoneCondition,
  createInstallationAndRisk,
  createInterestedParties,
  createMonitoringConditions,
  createMonitoringConditionsAlcohol,
  createMonitoringConditionsAttendance,
  createMonitoringConditionsTrail,
  createResponsibleAdult,
  getFilledMockOrder,
  getMockOrder,
} from '../../test/mocks/mockOrder'
import paths from '../constants/paths'
import TaskListService, { Page, Task } from './taskListService'
import { Order } from '../models/Order'

describe('TaskListService', () => {
  describe('getNextPage', () => {
    it('should return idenity numbers if current page is device wearer and adultAtTheTimeOfInstallation is true', () => {
      // Given
      const currentPage = 'DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ adultAtTimeOfInstallation: true }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id))
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

    it('should return idenity numbers if current page is responsible adult', () => {
      // Given
      const currentPage = 'RESPONSIBLE_ADULT'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is idenity numbers', () => {
      // Given
      const currentPage = 'IDENTITY_NUMBERS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return contact details if current page is check your answers', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id))
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

    it('should return interested parties if current page is no fixed abode and noFixedAbode is true', () => {
      // Given
      const currentPage = 'NO_FIXED_ABODE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: true }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
    })

    it('should return primary address if current page is no fixed abode and noFixedAbode is false', () => {
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
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'primary').replace(
          ':orderId',
          order.id,
        ),
      )
    })

    it('should return interested parties if current page is primary address and hasAnotherAddress is false', () => {
      // Given
      const currentPage = 'PRIMARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order, {
        hasAnotherAddress: false,
        addressType: 'primary',
      })

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
    })

    it('should return secondary address if current page is primary address and hasAnotherAddress is true', () => {
      // Given
      const currentPage = 'PRIMARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order, {
        hasAnotherAddress: true,
        addressType: 'primary',
      })

      // Then
      expect(nextPage).toBe(
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'secondary').replace(
          ':orderId',
          order.id,
        ),
      )
    })

    it('should return interested parties if current page is seconddary address and hasAnotherAddress is false', () => {
      // Given
      const currentPage = 'SECONDARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order, {
        hasAnotherAddress: false,
        addressType: 'seconddary',
      })

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
    })

    it('should return tertiary address if current page is secondary address and hasAnotherAddress is true', () => {
      // Given
      const currentPage = 'SECONDARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ noFixedAbode: false }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order, {
        hasAnotherAddress: true,
        addressType: 'secondary',
      })

      // Then
      expect(nextPage).toBe(
        paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', 'tertiary').replace(
          ':orderId',
          order.id,
        ),
      )
    })

    it('should return interested parties if current page is tertiary address', () => {
      // Given
      const currentPage = 'TERTIARY_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id))
    })

    it('should return check your answers if current page is interested parties', () => {
      // Given
      const currentPage = 'INTERESTED_PARTIES'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('should return installation and risk if current page is check your answers', () => {
      // Given
      const currentPage = 'CHECK_ANSWERS_CONTACT_INFORMATION'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id))
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
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id))
    })

    it('should return installation address if current page is monitoring conditions', () => {
      // Given
      const currentPage = 'MONITORING_CONDITIONS'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(
        paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', 'installation').replace(
          ':orderId',
          order.id,
        ),
      )
    })

    it('should return curfew release date if current page is installation address and curfew was selected', () => {
      // Given
      const currentPage = 'INSTALLATION_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id))
    })

    it('should return exclusion zone if current page is installation address and exclusionZone was selected', () => {
      // Given
      const currentPage = 'INSTALLATION_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id))
    })

    it('should return trail monitoring if current page is installation address and trail was selected', () => {
      // Given
      const currentPage = 'INSTALLATION_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          trail: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id))
    })

    it('should return attendance monitoring if current page is installation address and mandatoryAttendance was selected', () => {
      // Given
      const currentPage = 'INSTALLATION_ADDRESS'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is installation address and alcohol was selected', () => {
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
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id))
    })

    it('should return curfew conditions if current page is curfew release date', () => {
      // Given
      const currentPage = 'CURFEW_RELEASE_DATE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          curfew: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id))
    })

    it('should return curfew timetable if current page is curfew conitions', () => {
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
      expect(nextPage).toBe(paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id))
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
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })

    it.each([
      ['DEVICE_WEARER', paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS],
      ['CONTACT_DETAILS', paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS],
      ['INSTALLATION_AND_RISK', paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS],
      ['MONITORING_CONDITIONS', paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS],
    ])(
      'should return check your answers if all other pages have been completed for that section',
      (page: string, url: string) => {
        // Given
        const currentPage = page as Page
        const taskListService = new TaskListService()
        const order = getFilledMockOrder()

        // When
        const nextPage = taskListService.getNextPage(currentPage, order)

        // Then
        expect(nextPage).toBe(url.replace(':orderId', order.id))
      },
    )
  })

  describe('getSections', () => {
    it('should return all tasks grouped by section and marked as incomplete', () => {
      // Given
      const order = getMockOrder()
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getSections(order)

      // Then
      expect(sections).toEqual([
        {
          completed: false,
          name: 'ABOUT_THE_DEVICE_WEARER',
          path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'CONTACT_INFORMATION',
          path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'RISK_INFORMATION',
          path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ELECTRONIC_MONITORING_CONDITIONS',
          path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ADDITIONAL_DOCUMENTS',
          path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
        },
      ])
    })

    it('should return all tasks grouped by section and marked as complete', () => {
      // Given
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({
          nomisId: '',
          firstName: '',
          noFixedAbode: true,
        }),
        deviceWearerResponsibleAdult: createResponsibleAdult(),
        contactDetails: createContactDetails(),
        installationAndRisk: createInstallationAndRisk(),
        interestedParties: createInterestedParties(),
        enforcementZoneConditions: [createEnforcementZoneCondition()],
        addresses: [
          createAddress({ addressType: 'PRIMARY' }),
          createAddress({ addressType: 'SECONDARY' }),
          createAddress({ addressType: 'TERTIARY' }),
          createAddress({ addressType: 'INSTALLATION' }),
        ],
        monitoringConditions: createMonitoringConditions({ isValid: true }),
        monitoringConditionsTrail: createMonitoringConditionsTrail(),
        monitoringConditionsAlcohol: createMonitoringConditionsAlcohol(),
        mandatoryAttendanceConditions: [createMonitoringConditionsAttendance()],
        curfewReleaseDateConditions: createCurfewReleaseDateConditions(),
        curfewConditions: createCurfewConditions(),
        curfewTimeTable: createCurfewTimeTable(),
      })
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getSections(order)

      // Then
      expect(sections).toEqual([
        {
          completed: true,
          name: 'ABOUT_THE_DEVICE_WEARER',
          path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: true,
          name: 'CONTACT_INFORMATION',
          path: paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: true,
          name: 'RISK_INFORMATION',
          path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: true,
          name: 'ELECTRONIC_MONITORING_CONDITIONS',
          path: paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ADDITIONAL_DOCUMENTS',
          path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
        },
      ])
    })

    it('should return all tasks grouped by section and ready to start', () => {
      // Given
      const order = getMockOrder({
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
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getSections(order)

      // Then
      expect(sections).toEqual([
        {
          completed: false,
          name: 'ABOUT_THE_DEVICE_WEARER',
          path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'CONTACT_INFORMATION',
          path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'RISK_INFORMATION',
          path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ELECTRONIC_MONITORING_CONDITIONS',
          path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ADDITIONAL_DOCUMENTS',
          path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
        },
      ])
    })

    it('should return all tasks grouped by section and ready to start for a variation', () => {
      // Given
      const order = getMockOrder({
        type: 'VARIATION',
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
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getSections(order)

      // Then
      expect(sections).toEqual([
        {
          completed: false,
          name: 'VARIATION_DETAILS',
          path: paths.VARIATION.VARIATION_DETAILS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ABOUT_THE_DEVICE_WEARER',
          path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'CONTACT_INFORMATION',
          path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'RISK_INFORMATION',
          path: paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ELECTRONIC_MONITORING_CONDITIONS',
          path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ADDITIONAL_DOCUMENTS',
          path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
        },
      ])
    })
    it('should return links to the check your answers pages if the order has been submitted', () => {
      // Given
      const order = getMockOrder({
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
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getSections(order)

      expect(sections).toEqual([
        {
          completed: false,
          name: 'ABOUT_THE_DEVICE_WEARER',
          path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'CONTACT_INFORMATION',
          path: paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'RISK_INFORMATION',
          path: paths.INSTALLATION_AND_RISK.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ELECTRONIC_MONITORING_CONDITIONS',
          path: paths.MONITORING_CONDITIONS.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
        },
        {
          completed: false,
          name: 'ADDITIONAL_DOCUMENTS',
          path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
        },
      ])
    })
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

    it('returns contact info CYA if current page is device wearer CYA', () => {
      const taskListService = new TaskListService()

      const nextPage = taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_DEVICE_WEARER', order)

      expect(nextPage).toBe(paths.CONTACT_INFORMATION.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
    })

    it('returns risk information CYA if current page is contact info CYA', () => {
      const taskListService = new TaskListService()

      const nextPage = taskListService.getNextCheckYourAnswersPage('CHECK_ANSWERS_CONTACT_INFORMATION', order)

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

      const result = taskListService.getCheckYourAnswerPathForSection(tasks)

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

      const result = taskListService.getCheckYourAnswerPathForSection(tasks)

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

      const result = taskListService.getCheckYourAnswerPathForSection(tasks)

      expect(result).toBe(paths.INSTALLATION_AND_RISK.INSTALLATION_AND_RISK)
    })
  })
})
