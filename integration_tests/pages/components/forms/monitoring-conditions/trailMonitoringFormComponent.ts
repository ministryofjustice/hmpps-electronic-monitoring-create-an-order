import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'

export type TrailMonitoringFormData = {
  isPartOfACP?: string
  isPartOfDAPOL?: string
  orderType?: string
  monitoringType?: string
  startDate?: Date
  endDate?: Date
  installLocation?: string | RegExp
}

export default class TrailMonitoringFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date when the monitoring starts')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date when the monitoring ends (optional)')
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
