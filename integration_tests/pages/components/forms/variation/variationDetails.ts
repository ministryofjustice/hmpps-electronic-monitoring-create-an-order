import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type VariationDetailsFormData = {
  variationType?: string
  variationDate?: Date
}

export default class VariationDetailsFormComponent extends FormComponent {
  // FIELDS

  get variationTypeField(): FormRadiosComponent {
    const label = 'What have you changed in the form?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get variationDateField(): FormDateComponent {
    const label = 'What is the date you want the changes to take effect?'
    return new FormDateComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith(profile: VariationDetailsFormData): void {
    if (profile.variationDate) {
      this.variationDateField.set(profile.variationDate)
    }

    if (profile.variationType) {
      this.variationTypeField.set(profile.variationType)
    }
  }

  shouldBeValid(): void {
    this.variationTypeField.shouldNotHaveValidationMessage()
    this.variationDateField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.variationDateField.shouldBeDisabled()
    this.variationTypeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.variationDateField.shouldNotBeDisabled()
    this.variationTypeField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.variationTypeField.shouldHaveAllOptions()
  }
}
