import { Order } from '../../models/Order'
import SectionListService, { Section, TaskSection } from './service'

const containsSection = (sections: TaskSection[], name: Section) => {
  expect(sections.find(section => section.name === name) !== undefined).toBe(true)
}

const containsSections = (sections: TaskSection[], names: Section[]) => {
  names.forEach(name => containsSection(sections, name))
}

describe('task list service', () => {
  const service = new SectionListService()
  describe('get section list', () => {
    it('the notifying organisation is home office', () => {
      const order: Order = {
        interestedParties: { notifyingOrganisation: 'HOME_OFFICE' },
        monitoringConditions: { startDate: new Date(2040, 0).toISOString() },
      } as Order

      const sections = service.getSections(order)

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

      const sections = service.getSections(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_RESPONSIBLE_ORGANISATION',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the future', () => {
      const order: Order = { monitoringConditions: { startDate: new Date(2040, 0).toISOString() } } as Order

      const sections = service.getSections(order)

      expect(sections).toHaveLength(5)
      containsSections(sections, [
        'ABOUT_THE_RESPONSIBLE_ORGANISATION',
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })

    it('the start date is in the future', () => {
      const order: Order = { monitoringConditions: { startDate: new Date(2000, 0).toISOString() } } as Order

      const sections = service.getSections(order)

      expect(sections).toHaveLength(4)
      containsSections(sections, [
        'ABOUT_THE_DEVICE_WEARER',
        'RISK_INFORMATION',
        'ELECTRONIC_MONITORING_CONDITIONS',
        'ADDITIONAL_DOCUMENTS',
      ])
    })
  })
})
