import FormComponent from '../../formComponent'
import FormTextareaComponent from '../../formTextareaComponent'

export type CurfewAdditionalDetailsFormData = {
  curfewAdditionalDetails: string
}

export default class CurfewAdditionalDetailsFormComponent extends FormComponent {
  // FIELDS

  get curfewAdditionalDetails(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'Where will the device wearer be during curfew hours?')
  }

  // FORM HELPERS

  fillInWith(data: CurfewAdditionalDetailsFormData): void {
    if (data.curfewAdditionalDetails) {
      this.curfewAdditionalDetails.set(data.curfewAdditionalDetails)
    }
  }
}
