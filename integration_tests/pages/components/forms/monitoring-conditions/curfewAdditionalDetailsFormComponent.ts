import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormTextareaComponent from '../../formTextareaComponent'

export type CurfewAdditionalDetailsFormData = {
  curfewAdditionalDetails: string
}

export default class CurfewAdditionalDetailsFormComponent extends FormComponent {
  // FIELDS

  get curfewRadios(): FormRadiosComponent {
    const label = 'Do you want to change the standard curfew address boundary for any of the curfew addresses?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get descriptionField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'Enter details of what the curfew address boundary should include')
  }

  // FORM HELPERS

  fillInWith(curfewConditionDetails: CurfewAdditionalDetailsFormData) {
    if (curfewConditionDetails.curfewAdditionalDetails && curfewConditionDetails.curfewAdditionalDetails.length > 0) {
      this.curfewRadios.element.getByLabel('Yes').check()
      this.descriptionField.set(curfewConditionDetails.curfewAdditionalDetails)
    } else {
      this.curfewRadios.element.getByLabel('No').check()
    }
  }
}
