import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'

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
    return new FormDateComponent(this.form, 'What date does the curfew end?')
  }

  // FORM HELPERS

  fillInWith(data: CurfewConditionsFormData): void {
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
