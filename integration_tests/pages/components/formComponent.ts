import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default abstract class FormComponent {
  protected elementCacheId: string = uuidv4()

  constructor() {
    cy.get('form', { log: false }).as(this.elementCacheId)
  }

  protected get form(): PageElement {
    return cy.get(`@${this.elementCacheId}`, { log: false }) // [action*="contact-information/contact-details"]
  }

  checkHasForm(): void {
    this.form.should('exist')
  }

  hasAction(action: string | RegExp): PageElement {
    return this.form.should('have.attr', 'action', action)
  }

  shouldHaveEncType(encType: string): PageElement {
    return this.form.should('have.attr', 'encType', encType)
  }

  // ACTIONS

  get saveAndContinueButton(): PageElement {
    return this.form.contains('Save and continue')
  }

  get saveAsDraftButton(): PageElement {
    return this.form.contains('Save as draft')
  }

  get saveAndReturnButton(): PageElement {
    return this.form.contains('Save and return to main form menu')
  }
}
