import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type TrailMonitoringFormData = {
  startDate?: Date
  endDate?: Date
  deviceType?: string
}

export default class TrailMonitoringFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does trail monitoring start?')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does trail monitoring end?')
  }

  get deviceTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What type of trail monitoring device is needed?', [
      'A fitted GPS tag',
      'A non-fitted device',
    ])
  }

  // FORM HELPERS

  fillInWith(data: TrailMonitoringFormData): void {
    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }

    if (data.deviceType) {
      this.deviceTypeField.set(data.deviceType)
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
