import AppPage from './appPage'
import { PageElement } from './page'

export default class HDCPage extends AppPage {
  constructor() {
    super('Home Detention Curfew (HDC) form')
  }

  startButton = (): PageElement => cy.get('button:contains("Start Form")')
}
