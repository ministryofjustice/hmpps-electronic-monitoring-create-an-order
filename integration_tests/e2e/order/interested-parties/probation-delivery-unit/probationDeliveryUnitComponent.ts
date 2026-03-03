import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export type ProbationDeliveryUnitFormData = {
  unit?: string
}

export default class ProbationDeliveryUnitFormComponent extends FormComponent {
  get unitField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      "What is the Responsible Organisation's Probation Delivery Unit (PDU)?",
      [],
    )
  }

  fillInWith(profile: ProbationDeliveryUnitFormData) {
    if (profile.unit) {
      this.unitField.set(profile.unit)
    }
  }
}
