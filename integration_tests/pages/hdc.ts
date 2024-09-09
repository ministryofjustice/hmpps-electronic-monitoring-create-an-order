import Page, { PageElement } from './page'

export default class HDCPage extends Page {
  constructor() {
    super('Home Detention Curfew (HDC) form')
  }

  startButton = (): PageElement => cy.get('button:contains("Start Form")')
}
