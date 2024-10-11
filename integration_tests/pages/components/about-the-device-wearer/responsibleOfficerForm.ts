import { PageElement } from '../../page'

export default class ResponsibleOfficerFormComponent {
  private get form(): PageElement {
    return cy.get('form') // [action*="about-the-device-wearer/responsible-officer"]
  }

  checkHasForm(): void {
    this.form.should('exist')
  }

  hasAction = (action: string | RegExp): PageElement => this.form.should('have.attr', 'action', action)

  // ACTIONS

  saveAndContinueButton = (): PageElement => this.form.get('button[type=submit][value="continue"]')

  saveAndReturnButton = (): PageElement => this.form.get('button[type=submit][value="back"]')

  // FORM HELPERS

  fillInWith = (): undefined => {}
}
