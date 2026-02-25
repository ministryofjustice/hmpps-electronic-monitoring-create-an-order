import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export type ProbationDeliveryUnitFormData = {
  unit?: string
}

export default class ProbationDeliveryUnitFormComponent extends FormComponent {
  get unitField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, "What is the Responsible Organisation's Probation Delivery Unit (PDU)?", [
      'Not able to provide this information',
    ])
  }

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
