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

  fillInForm = (order: Order): void => {
    const groupedTimetables = order.curfewTimeTable.reduce((acc: Record<string, CurfewTimetable>, t) => {
      if (!acc[t.dayOfWeek]) {
        acc[t.dayOfWeek] = []
      }
      acc[t.dayOfWeek].push(t)
      return acc
    }, {})
    Object.entries(groupedTimetables).forEach(([day, timetables]) => {
      timetables.forEach((t, index) => {
        const [startHours, startMinutes] = deserialiseTime(t.startTime)
        const [endHours, endMinutes] = deserialiseTime(t.endTime)
        const displayDay = day.toLocaleLowerCase()
        if (index > 0) {
          cy.get(`button#add-time-${displayDay}`).click()
        }
        cy.get(`input#curfewTimetable-${displayDay}-${index}-time-start-hours`).type(startHours)
        cy.get(`input#curfewTimetable-${displayDay}-${index}-time-start-minutes`).type(startMinutes)
        cy.get(`input#curfewTimetable-${displayDay}-${index}-time-end-hours`).type(endHours)
        cy.get(`input#curfewTimetable-${displayDay}-${index}-time-end-minutes`).type(endMinutes)
        t.curfewAddress.split(',').forEach(address => {
          cy.get(`input#curfewTimetable-${displayDay}-${index}-addresses-${address}`).check()
        })
      })
    })
  }
}
