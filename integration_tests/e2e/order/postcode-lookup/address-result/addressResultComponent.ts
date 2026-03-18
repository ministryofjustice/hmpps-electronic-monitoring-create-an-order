import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'

export default class AddressResultComponent extends SingleQuestionFormComponent {
  fillInWith(value: string) {
    // TODO implement fillInWith method
    throw new Error(`Method not implemented.${value}`)
  }

  get addressResultsField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Select an address', [])
  }
}
