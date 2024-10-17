import Page, { PageElement } from '../page'

export default class AuthErrorPage extends Page {
  constructor() {
    super('Sorry, but you are not authorised', '/authError')
  }

  errorMessage = (): PageElement => cy.get('p')
}
