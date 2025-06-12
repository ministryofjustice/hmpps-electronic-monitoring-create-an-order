import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type CurfewAdditionalDetailsFormData = {
  curfewAdditionalDetails: string
}

export default class CurfewAdditionalDetailsFormComponent extends FormComponent {
  // FIELDS

  get curfewRadios(): FormRadiosComponent {
    const label = 'Do you want to change the standard curfew address boundary for any of the curfew addresses?'
    return new FormRadiosComponent(this.form, label, [])
  }

  get hasAnotherAddressField(): FormRadiosComponent {
    const label = 'Are electronic monitoring devices required at another address?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS
}
