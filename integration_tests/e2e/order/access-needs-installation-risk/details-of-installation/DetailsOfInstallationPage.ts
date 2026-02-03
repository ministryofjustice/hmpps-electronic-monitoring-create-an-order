import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import DetailsOfInstallationComponent from './DetailsOfInstallationComponent'

export default class DetailsOfInstallationPage extends AppFormPage {
  public form = new DetailsOfInstallationComponent()

  constructor() {
    const path = paths.INSTALLATION_AND_RISK.DETAILS_OF_INSTALLATION

    super('Risk at installation', path)
  }
}
