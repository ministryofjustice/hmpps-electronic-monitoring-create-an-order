import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type VariationDetailsFormData = {
  variationType?: string
  variationDate?: Date
  variationDetails?: string
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

  get variationDetailsAvailableField(): FormRadiosComponent {
    const label = 'Is there any other information to be aware of about the changes?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get variationDetailsField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Provide additional information about the changes')
  }

  // FORM HELPERS

  fillInWith(profile: VariationDetailsFormData): void {
    if (profile.variationDate) {
      this.variationDateField.set(profile.variationDate)
    }

    if (profile.variationType) {
      this.variationTypeField.set(profile.variationType)
    }

    if (profile.variationDetails) {
      this.variationDetailsAvailableField.set('Yes')
      this.variationDetailsField.set(profile.variationDetails)
    }
  }

  shouldBeValid(): void {
    this.variationTypeField.shouldNotHaveValidationMessage()
    this.variationDateField.shouldNotHaveValidationMessage()
    this.variationDetailsField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.variationDateField.shouldBeDisabled()
    this.variationTypeField.shouldBeDisabled()
    this.variationDetailsField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.variationDateField.shouldNotBeDisabled()
    this.variationTypeField.shouldNotBeDisabled()
    this.variationDetailsField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.variationTypeField.shouldHaveAllOptions()
  }
}
