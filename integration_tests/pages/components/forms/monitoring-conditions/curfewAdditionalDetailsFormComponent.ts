import FormComponent from '../../formComponent'
import FormTextareaComponent from '../../formTextareaComponent'

export type CurfewAdditionalDetailsFormData = {
  curfewAdditionalDetails: string
}

export default class CurfewAdditionalDetailsFormComponent extends FormComponent {
  // FIELDS

  get curfewAdditionalDetails(): FormTextareaComponent {
    return new FormTextareaComponent(
      this.form,
      'Do you want to change the standard curfew address boundary for any of the curfew addresses?',
    )
  }

  // FORM HELPERS

  fillInWith(data: CurfewAdditionalDetailsFormData): void {
    if (data.curfewAdditionalDetails) {
      this.curfewAdditionalDetails.set(data.curfewAdditionalDetails)
    }
  }
}
