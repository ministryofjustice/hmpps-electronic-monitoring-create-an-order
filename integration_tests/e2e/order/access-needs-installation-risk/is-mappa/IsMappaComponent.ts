import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

type IsMappaData = {
  isMappa?: string
}

export default class IsMappaComponent extends FormComponent {
  get isMappaField(): FormRadiosComponent {
    const label = 'Is the device wearer a Multi-Agency Public Protection Arrangements (MAPPA) offender?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No', 'Not able to provide this information'])
  }

  fillInWith(input: IsMappaData) {
    if (input.isMappa) {
      this.isMappaField.set(input.isMappa)
    }
  }
}
