import { v4 as uuidv4 } from 'uuid'

import { deserialiseTime } from '../../../../../server/utils/utils'
import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export type CurfewTimetableFormData = {
  day?: string
  startTime?: string
  endTime?: string
  addresses?: string[]
}

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class CurfewTimetableFormComponent extends FormComponent {
  checkHasForm(): void {
    super.checkHasForm()

    allDays.forEach((dayOfWeek: string) => {
      this.form.getByLegend(dayOfWeek).as(`${this.elementCacheId}-${dayOfWeek.toLowerCase()}`)
    })
  }

  // FIELDS

  day(day: string): PageElement {
    return this.form.get(`@${this.elementCacheId}-${day.toLowerCase()}`, { log: false })
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
      this.day(dayOfWeek).should('exist')

      grouped[dayOfWeek].forEach((entry: CurfewTimetableFormData, index: number) => {
        const cacheId = `${dayOfWeek}-${index}-${uuidv4()}`
        this.day(dayOfWeek).within(() => {
          cy.get('.schedule').eq(index).as(cacheId)

          const [startHours, startMinutes] = deserialiseTime(entry.startTime)
          cy.get(`@${cacheId}`).getByLabel('Start Hour').type(startHours)
          cy.get(`@${cacheId}`).getByLabel('Start Minutes').type(startMinutes)

          const [endHours, endMinutes] = deserialiseTime(entry.endTime)
          cy.get(`@${cacheId}`).getByLabel('End Hour').type(endHours)
          cy.get(`@${cacheId}`).getByLabel('End Minutes').type(endMinutes)

          entry.addresses?.forEach((address: string) => {
            cy.get(`@${cacheId}`).getByLabel(address).check()
          })

          if (index < grouped[dayOfWeek].length - 1) {
            cy.contains('Add another time').click()

            // have to refresh cache after page load
            allDays.forEach((dayName: string) => {
              this.form.getByLegend(dayName).as(`${this.elementCacheId}-${dayName.toLowerCase()}`)
            })
          }
        })
      })
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

    allEntries.forEach((day: string) => {
      this.day(day).should('exist')
      this.day(day).getByLabel('Start Hour').should('exist')
      this.day(day).getByLabel('Start Minutes').should('exist')

      this.day(day).getByLabel('End Hour').should('exist')
      this.day(day).getByLabel('End Minutes').should('exist')

      this.day(day).getByLabel('Primary address').should('exist')
      this.day(day).getByLabel('Secondary address').should('exist')
      this.day(day).getByLabel('Tertiary address').should('exist')
    })
  }

  shouldBeDisabled(entries?: string[]): void {
    const allEntries = entries || allDays

    allEntries.forEach((day: string) => {
      this.day(day).should('exist')
      this.day(day).getByLabel('Start Hour').should('be.disabled')
      this.day(day).getByLabel('Start Minutes').should('be.disabled')

      this.day(day).getByLabel('End Hour').should('be.disabled')
      this.day(day).getByLabel('End Minutes').should('be.disabled')

      this.day(day).getByLabel('Primary address').should('be.disabled')
      this.day(day).getByLabel('Secondary address').should('be.disabled')
      this.day(day).getByLabel('Tertiary address').should('be.disabled')
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

      this.day(day).getByLabel('Primary address').should('be.empty')
      this.day(day).getByLabel('Secondary address').should('be.empty')
      this.day(day).getByLabel('Tertiary address').should('be.empty')
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

      entry.addresses?.forEach((address: string) => {
        this.day(day).getByLabel(address).should('be.checked')
      })
    })
  }
}