import paths from '../../../../../server/constants/paths'
import AppPage from '../../../../pages/appPage'
import { PageElement } from '../../../../pages/page'

export default class RemoveMonitoringTypePage extends AppPage {
  constructor() {
    super(
      'Are you sure that you want to delete this electronic monitoring type?',
      paths.MONITORING_CONDITIONS.REMOVE_MONITORING_TYPE,
    )
  }

  confirmRemoveButton = (): PageElement => cy.get('#confirm-remove-button')

  cancelButton = (): PageElement => cy.get('#cancel-button')
}
