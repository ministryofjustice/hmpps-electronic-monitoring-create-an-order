import Page, { PageElement } from '../page'

export default class AuthErrorPage extends Page {
  constructor() {
    super('Authorisation Error')
  }

  errorMessage = (): PageElement => cy.get('p')
}
