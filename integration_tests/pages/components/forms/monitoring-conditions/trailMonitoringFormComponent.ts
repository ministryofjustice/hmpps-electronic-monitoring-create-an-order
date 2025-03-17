import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'

export type TrailMonitoringFormData = {
  startDate?: Date
  endDate?: Date
}

export default class TrailMonitoringFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does trail monitoring start?')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does trail monitoring end?')
  }

  // FORM HELPERS

  fillInWith(data: TrailMonitoringFormData): void {
    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }
  }

  shouldBeValid(): void {
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
  }
}
