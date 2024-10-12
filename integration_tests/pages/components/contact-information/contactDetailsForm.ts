import { PageElement } from '../../page'
import FormInputComponent from '../formInputComponent'

export type ContactDetailsFormData = {
  contactNumber?: string
}

export default class ContactDetailsFormComponent {
  private get form(): PageElement {
    return cy.get('form') // [action*="contact-information/contact-details"]
  }

  checkHasForm(): void {
    this.form.should('exist')
  }

  hasAction(action: string | RegExp): PageElement {
    return this.form.should('have.attr', 'action', action)
  }

  // CONTACT NUMBER

  get contactDetailsFieldSet(): PageElement {
    return this.form.getByLegend('Contact details')
  }

  get contactNumberField(): FormInputComponent {
    const label = 'Enter a telephone number we can use to contact the device wearer.'
    return new FormInputComponent(this.contactDetailsFieldSet, label)
  }

  // ACTIONS

  get saveAndContinueButton(): PageElement {
    return this.form.get('button[type=submit][value="continue"]')
  }

  get saveAndReturnButton(): PageElement {
    return this.form.get('button[type=submit][value="back"]')
  }

  // FORM HELPERS

  fillInWith(profile: ContactDetailsFormData): undefined {
    if (profile.contactNumber) {
      this.contactNumberField.set(profile.contactNumber)
    }
  }
}
