import FormComponent from '../../../../../pages/components/formComponent'
import { PageElement } from '../../../../../pages/page'
import FormDateTimeComponent from '../../../../../pages/components/formDateTimeComponent'

export default class MonitoringDatesComponent extends FormComponent {
  get startDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'startDate')
  }

  get endDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'endDate')
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
