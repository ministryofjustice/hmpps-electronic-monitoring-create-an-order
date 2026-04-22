import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import { PageElement } from '../../../../pages/page'

export default class ConfirmAddressComponent extends SingleQuestionFormComponent {
  fillInWith(value: string) {
    throw new Error(`Method not implemented.${value}`)
  }

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
