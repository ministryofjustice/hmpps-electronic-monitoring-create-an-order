import { PageElement } from '../../../../../pages/page'
import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import EnforcementZoneAddToListFormComponent from './EnforcementZoneComponent'

export default class EnforcementZoneAddToListPage extends AppFormPage {
  public form: EnforcementZoneAddToListFormComponent

  constructor(zoneType: 'exclusion' | 'restriction') {
    super(
      `${zoneType.charAt(0).toUpperCase() + zoneType.slice(1)} zone monitoring `,
      paths.MONITORING_CONDITIONS.ZONE_ADD_TO_LIST.replace(':zoneType', zoneType),
      'Electronic monitoring required',
    )

    this.form = new EnforcementZoneAddToListFormComponent(zoneType)
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
