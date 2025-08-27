import AppFormPage from '../../appFormPage'

import paths from '../../../../server/constants/paths'

import InstallationLocationFormComponent from '../../components/forms/monitoring-conditions/installationLocationFormComponent'

export default class InstallationLocationPage extends AppFormPage {
  public form = new InstallationLocationFormComponent()

  constructor() {
    super('', paths.MONITORING_CONDITIONS.INSTALLATION_LOCATION, 'Electronic monitoring required')
  }

  checkOnPage(): void {
    super.checkOnPage()

    this.form.checkHasForm()
  }
}
