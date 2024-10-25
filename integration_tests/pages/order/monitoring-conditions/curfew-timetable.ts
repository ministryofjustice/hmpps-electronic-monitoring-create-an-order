import { CurfewTimetable } from '../../../../server/models/CurfewTimetable'
import { Order } from '../../../../server/models/Order'
import { deserialiseTime } from '../../../../server/utils/utils'

import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import CurfewTimetableFormComponent from '../../components/forms/monitoring-conditions/curfewTimetableFormComponent'

export default class CurfewTimetablePage extends AppFormPage {
  public form = new CurfewTimetableFormComponent()

  constructor() {
    super(
      'Monitoring conditions',
      paths.MONITORING_CONDITIONS.CURFEW_TIMETABLE,
      'Timetable for curfew with electronic monitoring',
    )
  }

  fillInForm = (order: Order): void => {
    // this.form.fillInWith(order.curfewTimeTable)

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
