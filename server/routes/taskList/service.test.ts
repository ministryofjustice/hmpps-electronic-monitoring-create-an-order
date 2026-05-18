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
      const order: Order = { interestedParties: { notifyingOrganisation: 'HOME_OFFICE' } } as Order

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
