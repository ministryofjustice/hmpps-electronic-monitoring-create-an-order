import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormTimespanComponent from '../../formTimespanComponent'

export type CurfewReleaseDateFormData = {
  releaseDate?: Date
  startTime?: string
  endTime?: string
  address?: string
}

export default class CurfewReleaseDateFormComponent extends FormComponent {
  // FIELDS

  get releaseDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Release date')
  }

  get timespanField(): FormTimespanComponent {
    return new FormTimespanComponent(this.form, 'Curfew hours on the day of release')
  }

  get addressField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Curfew address on the day of release', [
      'Primary address',
      'Secondary address',
      'Tertiary address',
    ])
  }

  // FORM HELPERS

  fillInWith(data: CurfewReleaseDateFormData): void {
    if (data.releaseDate) {
      this.releaseDateField.set(data.releaseDate)
    }

    if (data.startTime || data.endTime) {
      this.timespanField.set(data.startTime, data.endTime)
    }

    if (data.address) {
      this.addressField.set(data.address)
    }
  }

  shouldBeValid(): void {
    this.releaseDateField.shouldNotHaveValidationMessage()
    this.timespanField.shouldNotHaveValidationMessage()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.releaseDateField.shouldBeDisabled()
    this.timespanField.shouldBeDisabled()
    this.addressField.shouldNotHaveValidationMessage()
  }
}
