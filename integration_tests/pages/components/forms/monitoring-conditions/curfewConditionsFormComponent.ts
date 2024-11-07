import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormCheckboxesComponent from '../../formCheckboxesComponent'

export type CurfewConditionsFormData = {
  startDate?: Date
  endDate?: Date
  addresses?: string | string[]
}

export default class CurfewConditionsFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring starts')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring ends. (optional)')
  }

  get addressesField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'Curfew addresses', [
      'Primary address',
      'Secondary address',
      'Tertiary address',
    ])
  }

  // FORM HELPERS

  fillInWith(data: CurfewConditionsFormData): void {
    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }

    if (data.addresses) {
      this.addressesField.set(data.addresses)
    }
  }

  shouldBeValid(): void {
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.addressesField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.addressesField.shouldBeDisabled()
  }
}
