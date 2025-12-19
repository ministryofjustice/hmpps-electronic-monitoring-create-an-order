import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceListComponent from './offenceListComponent'

export default class OffenceListPage extends AppFormPage {
  public form = new OffenceListComponent()

  constructor() {
    super('WIP Offence List', paths.INSTALLATION_AND_RISK.OFFENCE_LIST)
  }
}
