import { CurfewTimetable } from '../../../server/models/CurfewTimetable'
import { Order } from '../../../server/models/Order'
import { deserialiseTime } from '../../../server/utils/utils'
import AppPage from '../appPage'
import { PageElement } from '../page'

export default class CurfewTimetablePage extends AppPage {
  constructor() {
    super('Monitoring conditions')
  }

  form = (): PageElement => cy.get('form')

  subHeader = (): PageElement => cy.get('h2')

  saveAndContinueButton = (): PageElement => cy.get('form button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => cy.get('form button[type=submit][value="back"]')

  backToSummaryButton = (): PageElement => cy.get('a#backToSummary')

  fillInForm = (order: Order): void => {
    const groupedTimetables = order.monitoringConditionsCurfewTimetable.reduce(
      (acc: Record<string, CurfewTimetable[]>, t) => {
        if (!acc[t.day]) {
          acc[t.day] = []
        }
        acc[t.day].push(t)
        return acc
      },
      {},
    )
    Object.entries(groupedTimetables).forEach(([day, timetables]) => {
      timetables.forEach((t, index) => {
        const [startHours, startMinutes] = deserialiseTime(t.startTime)
        const [endHours, endMinutes] = deserialiseTime(t.endTime)

        if (index > 0) {
          cy.get(`a#add-time-${day}`).click()
        }
        cy.get(`input#curfewTimetable-${day}-${index}-time-start-hours`).type(startHours)
        cy.get(`input#curfewTimetable-${day}-${index}-time-start-minutes`).type(startMinutes)
        cy.get(`input#curfewTimetable-${day}-${index}-time-end-hours`).type(endHours)
        cy.get(`input#curfewTimetable-${day}-${index}-time-end-minutes`).type(endMinutes)
        t.addresses.forEach(address => {
          cy.get(`#${day}-timetables .timetable-${index} input[value="${address}"]`).check()
        })
      })
    })
  }
}
