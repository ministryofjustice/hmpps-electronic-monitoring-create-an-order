import AppPage from '../../appPage'
import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'

import EnforcementZoneFormComponent from '../../components/forms/monitoring-conditions/enforcementZoneFormComponent'

export default class EnforcementZonePage extends AppPage {
  public form = new EnforcementZoneFormComponent()

  constructor() {
    super('Monitoring Conditions', paths.MONITORING_CONDITIONS.ZONE, 'Exclusion and inclusion zones')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }

  get backToSummaryButton(): PageElement {
    return cy.get('a#backToSummary')
  }
}
