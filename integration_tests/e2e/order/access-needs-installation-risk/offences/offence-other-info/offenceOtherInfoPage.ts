import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceOtherInfoComponent from './offenceOtherInfoComponent'

export default class OffenceOtherInfoPage extends AppFormPage {
  public form = new OffenceOtherInfoComponent()

  constructor() {
    super('WIP OffenceOtherInfo', paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO)
  }
}
