import FormComponent from '../../../../../pages/components/formComponent'
import { PageElement } from '../../../../../pages/page'
import FormDateComponent from '../../../../../pages/components/formDateComponent'

export default class MonitoringDatesComponent extends FormComponent {
  get startDateField(): FormDateComponent {
    const label = 'What is the date for the first day of all monitoring?'
    return new FormDateComponent(this.form, label)
  }

  get endDateField(): FormDateComponent {
    const label = 'What is the date when all monitoring ends?'
    return new FormDateComponent(this.form, label)
  }

  get backButton(): PageElement {
    return this.form.contains('Cancel and return back to form')
  }

  fillInWith(data: {
    startDate?: { day: string; month: string; year: string }
    endDate?: { day: string; month: string; year: string }
  }) {
    if (data.startDate) {
      this.startDateField.setDay(data.startDate.day)
      this.startDateField.setMonth(data.startDate.month)
      this.startDateField.setYear(data.startDate.year)
    }
    if (data.endDate) {
      this.endDateField.setDay(data.endDate.day)
      this.endDateField.setMonth(data.endDate.month)
      this.endDateField.setYear(data.endDate.year)
    }
  }
}
