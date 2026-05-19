import paths from '../../constants/paths'
import { Order } from '../../models/Order'
import TaskListService, { Task } from '../../services/taskListService'
import SectionListService, { SectionName, TaskSection } from './service'

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

  beforeEach(() => {
    mockTaskListService.getTasks.mockReturnValue([])
    mockTaskListService.getCheckYourAnswersPathForSection.mockReturnValue('')
    mockTaskListService.getNextTaskPath.mockReturnValue('')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const service = new SectionListService(mockTaskListService)

  describe('get section list', () => {
    it('the notifying organisation is home office', () => {
      const order: Order = {
        interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
        monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
      } as Order

      const sections = service.getSectionsForOrder(order)

      expect(sections).toHaveLength(4)
      containsSections(sections, [
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the notifying organisation is not home office', () => {
      const order: Order = {
        interestedParties: { notifyingOrganisation: 'PRISON' },
        monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
      } as Order

      const sections = service.getSectionsForOrder(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the future', () => {
      const order: Order = { monitoringConditions: { startDate: new Date(2040, 0).toISOString() } } as Order

      const sections = service.getSectionsForOrder(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the future', () => {
      const order: Order = { monitoringConditions: { startDate: new Date(2000, 0).toISOString() } } as Order

      const sections = service.getSectionsForOrder(order)

      expect(sections).toHaveLength(4)
      containsSections(sections, [
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    describe('section information', () => {
      const order: Order = {
        id: 'mockOrderId',
        monitoringConditions: { startDate: new Date(4000, 0).toISOString() },
      } as Order

      it('returns section information given task list', () => {
        const taskOne: Task = {
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        }

        mockTaskListService.getTasks.mockReturnValue([taskOne])

        const sections = service.getSectionsForOrder(order)

        const firstSection = sections[0]

        expect(firstSection.completed).toBe(true)
        expect(firstSection.path).toBeDefined()
        expect(firstSection.isReady).toBe(true)
      })

      it('complete section, get cya path', () => {
        const taskOne: Task = {
          section: 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
          name: 'INTERESTED_PARTIES',
          path: paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION,
          state: 'REQUIRED',
          completed: true,
        }

        mockTaskListService.getTasks.mockReturnValue([taskOne])
        mockTaskListService.getCheckYourAnswersPathForSection.mockReturnValue('mockCYAPath')

        const sections = service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!

        expect(interestedPartiesSection.path).toBe('mockCYAPath')
      })

      it('if order is not in progress, get cya path', () => {
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
        const sections = service.getSectionsForOrder(order)

        const interestedPartiesSection = sections.find(
          section => section.name === 'ABOUT_THE_NOTIFYING_AND_RESPONSIBLE_ORGANISATIONS',
        )!

        expect(interestedPartiesSection.path).toBe('mockPath')
      })
    })
  })
})
