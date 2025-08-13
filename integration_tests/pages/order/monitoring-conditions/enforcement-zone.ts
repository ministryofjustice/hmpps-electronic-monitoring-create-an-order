import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import EnforcementZoneFormComponent from '../../components/forms/monitoring-conditions/enforcementZoneFormComponent'
import { PageElement } from '../../page'

export default class EnforcementZonePage extends AppFormPage {
  public form = new EnforcementZoneFormComponent()

  constructor() {
    super('Exclusion zone monitoring ', paths.MONITORING_CONDITIONS.ZONE, 'Electronic monitoring required')
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
