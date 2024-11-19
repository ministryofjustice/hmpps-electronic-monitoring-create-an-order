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
  getMockOrder,
} from '../../test/mocks/mockOrder'
import paths from '../constants/paths'
import TaskListService from './taskListService'

describe('TaskListService', () => {
  describe('getNextPage', () => {
    it('should return check your answers if current page is device wearer and adultAtTheTimeOfInstallation is true', () => {
      // Given
      const currentPage = 'DEVICE_WEARER'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({ adultAtTimeOfInstallation: true }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
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

    it('should return check your answers if current page is responsible adult', () => {
      // Given
      const currentPage = 'RESPONSIBLE_ADULT'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id))
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

    it('should return installation and risk if current page is interested parties', () => {
      // Given
      const currentPage = 'INTERESTED_PARTIES'
      const taskListService = new TaskListService()
      const order = getMockOrder()

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.INSTALLATION_AND_RISK.replace(':orderId', order.id))
    })

    it('should return monitoring conditions if current page is installation and risk', () => {
      // Given
      const currentPage = 'INSTALLATION_AND_RISK'
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

    it('should return attachments if current page is curfew timetable and no other monitoring is selected', () => {
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
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })

    it('should return trail monitoring if current page is exclusion zone and trail is selected', () => {
      // Given
      const currentPage = 'ZONE'
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
      const currentPage = 'ZONE'
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
      const currentPage = 'ZONE'
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

    it('should return attachments if current page is exclusion zone and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ZONE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          exclusionZone: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })

    it('should return attendance monitoring if current page is trail monitoring and mandatoryAttendance is selected', () => {
      // Given
      const currentPage = 'TRAIL'
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
      const currentPage = 'TRAIL'
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

    it('should return attachments if current page is trail monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'TRAIL'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          trail: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })

    it('should return alcohol monitoring if current page is attendance monitoring and alcohol monitoring is selected', () => {
      // Given
      const currentPage = 'ATTENDANCE'
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

    it('should return attachments if current page is attendance monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ATTENDANCE'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          mandatoryAttendance: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })

    it('should return attachments if current page is alcohol monitoring and no other monitoring is selected', () => {
      // Given
      const currentPage = 'ALCOHOL'
      const taskListService = new TaskListService()
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({
          alcohol: true,
        }),
      })

      // When
      const nextPage = taskListService.getNextPage(currentPage, order)

      // Then
      expect(nextPage).toBe(paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id))
    })
  })

  describe('getTasksBySection', () => {
    it('should return all tasks grouped by section and marked as incomplete', () => {
      // Given
      const order = getMockOrder()
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getTasksBySection(order)

      // Then
      expect(sections).toEqual({
        ABOUT_THE_DEVICE_WEARER: [
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'RESPONSIBLE_ADULT',
            path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'CHECK_ANSWERS_DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
            state: 'CHECK_YOUR_ANSWERS',
            completed: true,
          },
        ],
        CONTACT_INFORMATION: [
          {
            section: 'CONTACT_INFORMATION',
            name: 'CONTACT_DETAILS',
            path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'NO_FIXED_ABODE',
            path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'PRIMARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'primary',
            ).replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'SECONDARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'secondary',
            ).replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'TERTIARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'tertiary',
            ).replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'INTERESTED_PARTIES',
            path: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
        ],
        INSTALLATION_AND_RISK: [
          {
            section: 'INSTALLATION_AND_RISK',
            name: 'INSTALLATION_AND_RISK',
            path: paths.INSTALLATION_AND_RISK.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
        ],
        MONITORING_CONDITIONS: [
          {
            section: 'MONITORING_CONDITIONS',
            name: 'MONITORING_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'INSTALLATION_ADDRESS',
            path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(
              ':addressType(installation)',
              'installation',
            ).replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_RELEASE_DATE',
            path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_TIMETABLE',
            path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ZONE',
            path: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'TRAIL',
            path: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ATTENDANCE',
            path: paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ALCOHOL',
            path: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: false,
          },
        ],
        ATTACHMENTS: [
          {
            section: 'ATTACHMENTS',
            name: 'ATTACHMENT',
            path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
        ],
      })
    })

    it('should return all tasks grouped by section and marked as complete', () => {
      // Given
      const order = getMockOrder({
        deviceWearer: createDeviceWearer({
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
        monitoringConditionsAttendance: [createMonitoringConditionsAttendance()],
        curfewReleaseDateConditions: createCurfewReleaseDateConditions(),
        curfewConditions: createCurfewConditions(),
        curfewTimeTable: createCurfewTimeTable(),
      })
      const taskListService = new TaskListService()

      // When
      const sections = taskListService.getTasksBySection(order)

      // Then
      expect(sections).toEqual({
        ABOUT_THE_DEVICE_WEARER: [
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'RESPONSIBLE_ADULT',
            path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'CHECK_ANSWERS_DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
            state: 'CHECK_YOUR_ANSWERS',
            completed: true,
          },
        ],
        CONTACT_INFORMATION: [
          {
            section: 'CONTACT_INFORMATION',
            name: 'CONTACT_DETAILS',
            path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'NO_FIXED_ABODE',
            path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'PRIMARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'primary',
            ).replace(':orderId', order.id),
            state: 'NOT_REQUIRED',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'SECONDARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'secondary',
            ).replace(':orderId', order.id),
            state: 'NOT_REQUIRED',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'TERTIARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'tertiary',
            ).replace(':orderId', order.id),
            state: 'NOT_REQUIRED',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'INTERESTED_PARTIES',
            path: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
        ],
        INSTALLATION_AND_RISK: [
          {
            section: 'INSTALLATION_AND_RISK',
            name: 'INSTALLATION_AND_RISK',
            path: paths.INSTALLATION_AND_RISK.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
        ],
        MONITORING_CONDITIONS: [
          {
            section: 'MONITORING_CONDITIONS',
            name: 'MONITORING_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'INSTALLATION_ADDRESS',
            path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(
              ':addressType(installation)',
              'installation',
            ).replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_RELEASE_DATE',
            path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_TIMETABLE',
            path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ZONE',
            path: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'TRAIL',
            path: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ATTENDANCE',
            path: paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ALCOHOL',
            path: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
            state: 'CANT_BE_STARTED',
            completed: true,
          },
        ],
        ATTACHMENTS: [
          {
            section: 'ATTACHMENTS',
            name: 'ATTACHMENT',
            path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
        ],
      })
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
      const sections = taskListService.getTasksBySection(order)

      // Then
      expect(sections).toEqual({
        ABOUT_THE_DEVICE_WEARER: [
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'RESPONSIBLE_ADULT',
            path: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'CHECK_ANSWERS_DEVICE_WEARER',
            path: paths.ABOUT_THE_DEVICE_WEARER.CHECK_YOUR_ANSWERS.replace(':orderId', order.id),
            state: 'CHECK_YOUR_ANSWERS',
            completed: true,
          },
        ],
        CONTACT_INFORMATION: [
          {
            section: 'CONTACT_INFORMATION',
            name: 'CONTACT_DETAILS',
            path: paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'NO_FIXED_ABODE',
            path: paths.CONTACT_INFORMATION.NO_FIXED_ABODE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: true,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'PRIMARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'primary',
            ).replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'SECONDARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'secondary',
            ).replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'TERTIARY_ADDRESS',
            path: paths.CONTACT_INFORMATION.ADDRESSES.replace(
              ':addressType(primary|secondary|tertiary)',
              'tertiary',
            ).replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
          {
            section: 'CONTACT_INFORMATION',
            name: 'INTERESTED_PARTIES',
            path: paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
        ],
        INSTALLATION_AND_RISK: [
          {
            section: 'INSTALLATION_AND_RISK',
            name: 'INSTALLATION_AND_RISK',
            path: paths.INSTALLATION_AND_RISK.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
        ],
        MONITORING_CONDITIONS: [
          {
            section: 'MONITORING_CONDITIONS',
            name: 'MONITORING_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.BASE_URL.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'INSTALLATION_ADDRESS',
            path: paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(
              ':addressType(installation)',
              'installation',
            ).replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_RELEASE_DATE',
            path: paths.MONITORING_CONDITIONS.CURFEW_RELEASE_DATE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_CONDITIONS',
            path: paths.MONITORING_CONDITIONS.CURFEW_CONDITIONS.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'CURFEW_TIMETABLE',
            path: paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ZONE',
            path: paths.MONITORING_CONDITIONS.ZONE.replace(':zoneId', '0').replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'TRAIL',
            path: paths.MONITORING_CONDITIONS.TRAIL.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ATTENDANCE',
            path: paths.MONITORING_CONDITIONS.ATTENDANCE.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'MONITORING_CONDITIONS',
            name: 'ALCOHOL',
            path: paths.MONITORING_CONDITIONS.ALCOHOL.replace(':orderId', order.id),
            state: 'REQUIRED',
            completed: false,
          },
        ],
        ATTACHMENTS: [
          {
            section: 'ATTACHMENTS',
            name: 'ATTACHMENT',
            path: paths.ATTACHMENT.ATTACHMENTS.replace(':orderId', order.id),
            state: 'OPTIONAL',
            completed: false,
          },
        ],
      })
    })
  })
})
