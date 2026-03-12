import paths from '../../../../../../server/constants/paths'
import AppPage from '../../../../../pages/appPage'
import { PageElement } from '../../../../../pages/page'

export default class NoRefitsPage extends AppPage {
  constructor() {
    super('You cannot use this service to request visits for refits or equipment checks', paths.ORDER.NO_REFITS)
  }

  returnToStartButton = (): PageElement => cy.get('#back-to-start-button')
}
