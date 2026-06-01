import paths from '../constants/paths'
import { Order } from '../models/Order'
import TaskListService, { Task } from './taskListService'
import SectionService, { SectionName, TaskSection } from './sectionsService'
import OrderChecklistService from './orderChecklistService'
import OrderChecklistModel from '../models/OrderChecklist'
import FeatureFlags from '../utils/featureFlags'

const containsSection = (sections: TaskSection[], name: SectionName) => {
  expect(sections.find(section => section.name === name) !== undefined).toBe(true)
}

const containsSections = (sections: TaskSection[], names: SectionName[]) => {
  names.forEach(name => containsSection(sections, name))
}

describe('task list service', () => {
  const mockTaskListService = {
    getTasks: jest.fn(),
    getCheckYourAnswersPathForSection: jest.fn(),
    getNextTaskPath: jest.fn(),
  } as unknown as jest.Mocked<TaskListService>

  const mockCheckListService = {
    getChecklist: jest.fn(),
  } as unknown as jest.Mocked<OrderChecklistService>

  beforeEach(() => {
    mockTaskListService.getTasks.mockReturnValue([])
    mockTaskListService.getCheckYourAnswersPathForSection.mockReturnValue('')
    mockTaskListService.getNextTaskPath.mockReturnValue('')

    mockCheckListService.getChecklist.mockResolvedValue(OrderChecklistModel.parse({}))

    const mockGet = jest.fn((flag: string) => flag === 'INTERESTED_PARTIES_FLOW_ENABLED')
    const mockGetValue = jest.fn(() => '')
    jest.spyOn(FeatureFlags, 'getInstance').mockReturnValue({
      get: mockGet,
      getValue: mockGetValue,
    } as never)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const service = new SectionService(mockTaskListService, mockCheckListService)

  describe('get section list', () => {
    it('the notifying organisation is home office', async () => {
      const order: Order = {
        interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
        monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
      } as Order

      const sections = await service.getSectionsForOrder(order)

      expect(sections).toHaveLength(4)
      containsSections(sections, [
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the notifying organisation is not home office', async () => {
      const order: Order = {
        interestedParties: { notifyingOrganisation: 'PRISON' },
        monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
      } as Order

      const sections = await service.getSectionsForOrder(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the future', async () => {
      const order: Order = { monitoringConditions: { startDate: new Date(2040, 0).toISOString() } } as Order

      const sections = await service.getSectionsForOrder(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the past and the order is a variation', async () => {
      const order: Order = {
        type: 'VARIATION',
        monitoringConditions: { startDate: new Date(2000, 0).toISOString() },
        interestedParties: {
          responsibleOrganisation: 'PROBATION',
          responsibleOfficerFirstName: 'James',
        },
      } as Order

      const sections = await service.getSectionsForOrder(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
        'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
      ])
    })

    it('the start date is in the past and the order is submitted', async () => {
      const order: Order = {
        status: 'SUBMITTED',
        type: 'VARIATION',
        monitoringConditions: { startDate: new Date(2000, 0).toISOString() },
        interestedParties: {
          responsibleOrganisation: 'PROBATION',
          responsibleOfficerFirstName: 'James',
        },
      } as Order

      const sections = await service.getSectionsForOrder(order)

      expect(sections).toHaveLength(6)
      containsSections(sections, [
        'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
        'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
      ])
    })

    describe('section information', () => {
      let order: Order
      beforeEach(() => {
        order = {
          interestedParties: { notifyingOrganisation: 'PRISON' },
          monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
        } as Order
      })

      it('returns section information given task list', async () => {
        const taskOne: Task = {
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        }

        mockTaskListService.getTasks.mockReturnValue([taskOne])

        const sections = await service.getSectionsForOrder(order)

        const firstSection = sections[0]

        expect(firstSection.completed).toBe(true)
        expect(firstSection.path).toBeDefined()
        expect(firstSection.isReady).toBe(true)
      })

      it('complete section, get cya path', async () => {
        const taskOne: Task = {
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        }

        mockTaskListService.getTasks.mockReturnValue([taskOne])
        mockTaskListService.getCheckYourAnswersPathForSection.mockReturnValue('mockCYAPath')

        const sections = await service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!

        expect(interestedPartiesSection.path).toBe('mockCYAPath')
      })

      it('if order is not in progress, get cya path', async () => {
        const taskOne: Task = {
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: false,
        }

        mockTaskListService.getTasks.mockReturnValue([taskOne])
        mockTaskListService.getCheckYourAnswersPathForSection.mockReturnValue('mockCYAPath')
        mockTaskListService.getNextTaskPath.mockReturnValue('mockPath')

        order.status = 'SUBMITTED'
        const sections = await service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!

        expect(interestedPartiesSection.path).toBe('mockPath')
      })
      it('section is complete when all tasks are', async () => {
        const tasks: Task[] = []
        tasks.push({
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        })

        mockTaskListService.getTasks.mockReturnValue(tasks)

        const sections = await service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!
        expect(interestedPartiesSection.completed).toBe(true)
      })

      it('section is not complete when a task is not', async () => {
        const tasks: Task[] = []
        tasks.push({
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: false,
        })
        tasks.push({
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        })

        mockTaskListService.getTasks.mockReturnValue(tasks)

        const sections = await service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!

        expect(interestedPartiesSection.completed).toBe(false)
      })

      it('section is complete when all tasks cannot be completed', async () => {
        const tasks: Task[] = [
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'DEVICE_WEARER',
            path: '',
            state: 'NOT_REQUIRED',
            completed: false,
          },
        ]
        mockTaskListService.getTasks.mockReturnValue(tasks)

        order = { monitoringConditions: { startDate: new Date(2040, 0).toISOString() } } as Order

        const sections = await service.getSectionsForOrder(order)
        const deviceWearerSection = sections.find(sec => sec.name === 'ABOUT_THE_DEVICE_WEARER')!
        expect(deviceWearerSection.completed).toBe(true)
      })

      it('electronic monitoring section affect completion state based on order', async () => {
        const tasks: Task[] = []
        tasks.push({
          section: 'ELECTRONIC_MONITORING_CONDITIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        })

        order = {
          interestedParties: { notifyingOrganisation: 'PRISON' },
          monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
          enforcementZoneConditions: [],
          mandatoryAttendanceConditions: [],
        } as unknown as Order

        mockTaskListService.getTasks.mockReturnValue(tasks)

        const sections = await service.getSectionsForOrder(order)

        const matchedSection = sections.find(section => section.name === 'ELECTRONIC_MONITORING_CONDITIONS')!

        expect(matchedSection.completed).toBe(false)
      })

      it('electronic monitoring section is not ready if device wearer section not complete', async () => {
        const tasks: Task[] = [
          {
            section: 'ABOUT_THE_DEVICE_WEARER',
            name: 'DEVICE_WEARER',
            path: '',
            state: 'REQUIRED',
            completed: false,
          },
          {
            section: 'ELECTRONIC_MONITORING_CONDITIONS',
            name: 'INTERESTED_PARTIES',
            path: '',
            state: 'REQUIRED',
            completed: false,
          },
        ]
        mockTaskListService.getTasks.mockReturnValue(tasks)

        const sections = await service.getSectionsForOrder(order)
        const emSection = sections.find(sec => sec.name === 'ELECTRONIC_MONITORING_CONDITIONS')!
        expect(emSection.isReady).toBe(false)
      })
    })
  })
})
