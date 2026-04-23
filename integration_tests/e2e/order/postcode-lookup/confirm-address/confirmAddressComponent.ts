import FormComponent from '../../../../pages/components/formComponent'
import { PageElement } from '../../../../pages/page'

export default class ConfirmAddressComponent extends FormComponent {
  get useDifferentAddressLink(): PageElement {
    return this.form.contains('Use a different address')
  }

  get enterAddressManuallyLink(): PageElement {
    return this.form.contains('Enter address manually')
  }

  get useAddressButton(): PageElement {
    return this.form.contains('Use this address')
  }
}
