import Page, { PageElement } from './page'

export default class HDCPage extends Page {
  constructor() {
    super('Home Detention Curfew(HDC) from')
  }

  startButton = (): PageElement => cy.get('button:contains("Start Form")')
}
