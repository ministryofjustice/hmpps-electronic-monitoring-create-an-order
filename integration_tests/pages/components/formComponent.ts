import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export default abstract class FormComponent {
  private elementCacheId: string = uuidv4()

  constructor() {
    cy.get('form').as(this.elementCacheId)
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

  // ACTIONS

  get saveAndContinueButton(): PageElement {
    return this.form.get('button[type=submit][value="continue"]')
  }

  get saveAndReturnButton(): PageElement {
    return this.form.get('button[type=submit][value="back"]')
  }
}
