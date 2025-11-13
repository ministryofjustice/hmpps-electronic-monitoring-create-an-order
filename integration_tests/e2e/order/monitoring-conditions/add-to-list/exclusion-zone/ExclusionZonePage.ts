import { PageElement } from '../../../../../pages/page'
import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import EnforcementZoneAddToListFormComponent from './ExclusionZoneComponent'

export default class EnforcementZonePage extends AppFormPage {
  public form = new EnforcementZoneAddToListFormComponent()

  constructor() {
    super('Exclusion zone monitoring ', paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST, 'Electronic monitoring required')
  }

  mapToolLink = (): PageElement => cy.get('#map-tool-link')

  mapToolOpensInNewTab() {
    this.mapToolLink()
      .should('have.attr', 'href', 'https://mapmaker.field-dynamics.co.uk/moj/map/default')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel')
      .and($rel => {
        expect($rel).to.match(/\bnoopener\b/)
        expect($rel).to.match(/\bnoreferrer\b/)
      })
  }
}
