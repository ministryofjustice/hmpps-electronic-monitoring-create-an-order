import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormCheckboxesComponent from '../../formCheckboxesComponent'

export type CurfewConditionsFormData = {
  startDate?: Date
  endDate?: Date
  addresses?: string | string[] | RegExp[]
}

export default class CurfewConditionsFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does the curfew start?')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does the curfew end? (optional)')
  }

  get addressesField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'Where will the device wearer be during curfew hours?', [
      /Main address/,
      /Second address/,
      /Third address/,
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
