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

  // FORM HELPERS

  fillInWith(curfewConditionDetails: CurfewAdditionalDetailsFormData) {
    if (curfewConditionDetails.curfewAdditionalDetails && curfewConditionDetails.curfewAdditionalDetails.length > 0) {
      this.curfewRadios.element.getByLabel('Yes').check()
      cy.get('#additional-details').type(curfewConditionDetails.curfewAdditionalDetails)
    } else {
      this.curfewRadios.element.getByLabel('No').check()
    }
  }
}
