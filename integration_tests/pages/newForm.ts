import Page, { PageElement } from './page'

export default class NewFormPage extends Page {
  constructor() {
    super('New Form')
  }

  selectFromLabel = (): PageElement => cy.get('h1:contains("Select from:")')

  formOptionRadios = (): PageElement => cy.get('[data-module=govuk-radios]')

  radioItem = (): PageElement => cy.get('.govuk-radios__item')

  nextButton = (): PageElement => cy.get('button:contains("Next")')
}
