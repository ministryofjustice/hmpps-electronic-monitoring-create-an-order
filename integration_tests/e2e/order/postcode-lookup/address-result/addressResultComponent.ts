import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import { PageElement } from '../../../../pages/page'

export default class AddressResultComponent extends SingleQuestionFormComponent {
  fillInWith(address: string) {
    this.addressResultsField.set(address)
  }

  get addressResultsField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Select an address', [])
  }

  get useAddressButton(): PageElement {
    return this.form.contains('Use this address')
  }
}
