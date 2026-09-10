import { PageElement } from '../page'

export default abstract class FormComponent {
  protected get form(): PageElement {
    return cy.get('form', { log: false })
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

  get continueButton(): PageElement {
    return this.form.contains('Continue')
  }

  get saveAsDraftButton(): PageElement {
    return this.form.contains('Save as draft')
  }

  get saveAndReturnButton(): PageElement {
    return this.form.contains('Save and return to main form menu')
  }
}
