import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type ProbationDeliveryUnitFormData = {
  unit?: string
}

export default class ProbationDeliveryUnitFormComponent extends FormComponent {
  // FIELDS

  get unitField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, "What is the Responsible Organisation's Probation Delivery Unit(PDU)", [
      'Not able to provide this information',
    ])
  }

  // FORM HELPERS

  fillInWith(profile: ProbationDeliveryUnitFormData): void {
    if (profile.unit) {
      this.unitField.set(profile.unit)
    }
  }

  shouldBeValid(): void {
    this.unitField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.unitField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.unitField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.unitField.shouldHaveAllOptions()
  }
}
