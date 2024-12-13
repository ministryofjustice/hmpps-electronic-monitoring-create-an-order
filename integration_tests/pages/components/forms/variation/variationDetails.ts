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
    const label = 'What would you like to vary?'
    return new FormRadiosComponent(this.form, label, [
      'Change of curfew hours',
      'Change of address',
      'Change to add an Inclusion or Exclusion Zone(s)',
      'Change to an existing Inclusion or Exclusion Zone(s).',
      'Order Suspension',
    ])
  }

  get variationDateField(): FormDateComponent {
    const label = 'When does the variation come into effect?'
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
}
