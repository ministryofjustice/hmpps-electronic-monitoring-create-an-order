import paths from '../../../../../../server/constants/paths'
import AppPage from '../../../../../pages/appPage'
import { PageElement } from '../../../../../pages/page'

export default class NoChangeResponsibleOfficerPage extends AppPage {
  constructor() {
    super('You cannot use this service to change the Responsible Officer', paths.ORDER.NO_CHANGE_RESPONSIBLE_OFFICER)
  }

  returnToStartButton = (): PageElement => cy.get('#back-to-start-button')
}
