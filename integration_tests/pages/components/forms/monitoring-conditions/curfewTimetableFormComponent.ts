import { deserialiseTime } from '../../../../../server/utils/utils'
import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export type CurfewTimetableFormData = {
  day?: string
  startTime?: string
  endTime?: string
  addresses?: string[] | RegExp[]
}

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class CurfewTimetableFormComponent extends FormComponent {
  // FIELDS

  day(day: string): PageElement {
    const titleCasedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
    return this.form.getByLegend(titleCasedDay)
  }

  get autoPopulateTimetableButton(): PageElement {
    return this.day('Monday').contains('Auto populate the other days with the same curfew hours')
  }

  autoPopulateTimetable(): void {
    this.autoPopulateTimetableButton.click()
  }

  fillInDay(dayOfWeek: string, entries: CurfewTimetableFormData[]): void {
    cy.wrap(entries).each((entry: CurfewTimetableFormData, index: number) => {
      this.day(dayOfWeek).within(() => {
        const schedule = () => cy.get('.schedule').eq(index)

        const [startHours, startMinutes] = deserialiseTime(entry.startTime)
        schedule().getByLabel('Start Hour').type(startHours)
        schedule().getByLabel('Start Minutes').type(startMinutes)

        const [endHours, endMinutes] = deserialiseTime(entry.endTime)
        schedule().getByLabel('End Hour').type(endHours)
        schedule().getByLabel('End Minutes').type(endMinutes)

        entry.addresses?.forEach(address => {
          schedule().getByLabel(address).check()
        })
      })

      if (index < entries.length - 1) {
        this.day(dayOfWeek).contains('Add another time').click()
        // Kitchen sink moves too quickly, this was here to avoid breaking existing tests
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
      }
    })
  }

  // FORM HELPERS

  fillInWith(data: CurfewTimetableFormData[]): void {
    const grouped = data.reduce((out, entry) => {
      if (out[entry.day]) {
        out[entry.day].push(entry)
        return out
      }

      return {
        ...out,
        [entry.day]: [entry],
      }
    }, {})

    Object.keys(grouped).forEach((dayOfWeek: string) => {
      this.fillInDay(dayOfWeek, grouped[dayOfWeek])
    })
  }

  shouldBeValid(): void {
    // not implemented
  }

  shouldHaveValidationMessage(day: string, message: string): void {
    this.day(day).contains(message).should('exist')
  }

  shouldBeDisplayed(entries?: string[]): void {
    const allEntries = entries || allDays

    allEntries.forEach((day: string, index: number) => {
      this.day(day).should('exist')
      this.day(day).getByLabel('Start Hour').should('exist')
      this.day(day).getByLabel('Start Minutes').should('exist')

      this.day(day).getByLabel('End Hour').should('exist')
      this.day(day).getByLabel('End Minutes').should('exist')

      this.day(day)
        .getByLabel(/Main address/)
        .should('exist')
      this.day(day)
        .getByLabel(/Second address/)
        .should('exist')
      this.day(day)
        .getByLabel(/Third address/)
        .should('exist')

      this.day(day).contains('Add another time').should('exist')
      if (index === 0) {
        this.autoPopulateTimetableButton.should('exist')
      }
    })
  }

  shouldBeDisabled(entries?: string[]): void {
    const allEntries = entries || allDays

    allEntries.forEach((day: string, index: number) => {
      this.day(day).should('exist')
      this.day(day).getByLabel('Start Hour').should('be.disabled')
      this.day(day).getByLabel('Start Minutes').should('be.disabled')

      this.day(day).getByLabel('End Hour').should('be.disabled')
      this.day(day).getByLabel('End Minutes').should('be.disabled')

      this.day(day)
        .getByLabel(/Main address/)
        .should('be.disabled')
      this.day(day)
        .getByLabel(/Second address/)
        .should('be.disabled')
      this.day(day)
        .getByLabel(/Third address/)
        .should('be.disabled')

      this.day(day).contains('Add another time').should('not.exist')
      if (index === 0) {
        this.autoPopulateTimetableButton.should('not.exist')
      }
    })
  }

  shouldBeEmpty(entries?: string[]): void {
    const allEntries = entries || allDays

    allEntries.forEach((day: string) => {
      this.day(day).should('exist')
      this.day(day).getByLabel('Start Hour').should('be.empty')
      this.day(day).getByLabel('Start Minutes').should('be.empty')

      this.day(day).getByLabel('End Hour').should('be.empty')
      this.day(day).getByLabel('End Minutes').should('be.empty')

      this.day(day)
        .getByLabel(/Main address/)
        .should('be.empty')
      this.day(day)
        .getByLabel(/Second address/)
        .should('be.empty')
      this.day(day)
        .getByLabel(/Third address/)
        .should('be.empty')
    })
  }

  shouldHaveEntries(entries: CurfewTimetableFormData[]): void {
    entries.forEach((entry: CurfewTimetableFormData) => {
      const { day } = entry

      const [startHours, startMinutes] = deserialiseTime(entry.startTime)
      this.day(day).getByLabel('Start Hour').should('have.value', startHours)
      this.day(day).getByLabel('Start Minutes').should('have.value', startMinutes)

      const [endHours, endMinutes] = deserialiseTime(entry.endTime)
      this.day(day).getByLabel('End Hour').should('have.value', endHours)
      this.day(day).getByLabel('End Minutes').should('have.value', endMinutes)

      entry.addresses?.forEach(address => {
        this.day(day).getByLabel(address).should('be.checked')
      })
    })
  }
}
