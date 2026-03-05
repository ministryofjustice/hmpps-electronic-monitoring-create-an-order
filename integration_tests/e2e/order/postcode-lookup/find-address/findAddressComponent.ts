import FormComponent from '../../../../pages/components/formComponent'
import FormTextareaComponent from '../../../../pages/components/formTextareaComponent'
import { PageElement } from '../../../../pages/page'

export default class FindAddressComponent extends FormComponent {
  get postcodeField(): FormTextareaComponent {
    const label = 'Postcode'
    return new FormTextareaComponent(this.form, label)
  }

  get buildingIdField(): FormTextareaComponent {
    const label = 'Building number or name (optional)'
    return new FormTextareaComponent(this.form, label)
  }

  fillInWith({ postcode, id }) {
    if (postcode) {
      this.postcodeField.set(postcode)
    }
    if (id) {
      this.buildingIdField.set(id)
    }
  }

  get findAddressButton(): PageElement {
    return this.form.contains('Find address')
  }
}
