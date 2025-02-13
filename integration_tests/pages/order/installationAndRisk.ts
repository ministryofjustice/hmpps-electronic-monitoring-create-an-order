import AppFormPage from '../appFormPage'

import paths from '../../../server/constants/paths'

import InstallationAndRiskFormComponent from '../components/forms/access-needs-installation-risk/installationAndRiskForm'

export default class InstallationAndRiskPage extends AppFormPage {
  public form = new InstallationAndRiskFormComponent()

  constructor() {
    super('Installation and risk information', paths.INSTALLATION_AND_RISK)
  }
}
