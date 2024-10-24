import FormCheckboxesComponent from '../../formCheckboxesComponent'
import FormComponent from '../../formComponent'
import FormTimespanComponent from '../../formTimespanComponent'

export type CurfewTimetableFormData = {
  startTime?: string
  endTime?: string
  address?: string
}

export default class CurfewTimetableFormComponent extends FormComponent {
  // FIELDS

  get timespanField(): FormTimespanComponent {
    return new FormTimespanComponent(this.form, 'Curfew hours on the day of release')
  }

  get addressField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'Curfew address on the day of release', [
      'Primary address',
      'Secondary address',
      'Tertiary address',
    ])
  }

  // FORM HELPERS

  fillInWith(data: CurfewTimetableFormData): void {
    if (data.startTime) {
      // do nothing
    }

    if (data.endTime) {
      // do nothing
    }

    if (data.address) {
      // do nothing
    }
  }

  shouldBeValid(): void {
    this.timespanField.shouldNotHaveValidationMessage()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.timespanField.shouldBeDisabled()
    this.addressField.shouldBeDisabled()
  }
}
