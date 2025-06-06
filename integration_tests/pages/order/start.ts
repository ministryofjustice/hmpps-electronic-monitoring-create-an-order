import Page, { PageElement } from '../page'

export default class StartPage extends Page {
  constructor() {
    super('Apply, change or end an Electronic Monitoring Order (EMO)', '/')
  }

  signInButton = (): PageElement => cy.get('#sign-in-button')
}
