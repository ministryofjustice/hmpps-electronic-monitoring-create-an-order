import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import { PageElement } from '../../../../../pages/page'
import TypesOfMonitoringNeededComponent from './TypesOfMonitoringNeededComponent'

export default class TypesOfMonitoringNeededPage extends AppFormPage {
  public form = new TypesOfMonitoringNeededComponent()

  constructor() {
    super('Types of monitoring needed', paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.TYPES_OF_MONITORING_NEEDED)
  }

  actionLinkByLable(questionText: string, action: 'Change' | 'Delete'): PageElement {
    return cy.contains('.govuk-summary-list__row', questionText).find('a').contains(action)
  }
}
