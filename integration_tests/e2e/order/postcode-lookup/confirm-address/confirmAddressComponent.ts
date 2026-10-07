import FormComponent from '../../../../pages/components/formComponent'
import { PageElement } from '../../../../pages/page'

export default class ConfirmAddressComponent extends FormComponent {
  get useDifferentAddressLink(): PageElement {
    return this.form.contains('Use a different address')
  }

  get searchForDifferentAddressLink(): PageElement {
    return this.form.contains('Search for a different address')
  }

  get enterAddressManuallyLink(): PageElement {
    return this.form.contains('Enter address manually')
  }

  get useAddressButton(): PageElement {
    return this.form.contains('Use this address')
  }

  get corePersonAddressInset(): PageElement {
    return cy.get('.govuk-inset-text.app-inset-text--information')
  }

  get noFixedAddressLink(): PageElement {
    return this.form.contains('The device wearer does not have a fixed address')
  }
}
