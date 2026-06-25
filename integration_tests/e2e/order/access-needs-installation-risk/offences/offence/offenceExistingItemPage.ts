import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceComponent from './offenceComponent'

export default class OffenceExistingItemPage extends AppFormPage {
  public form = new OffenceComponent()

  constructor() {
    super('What type of offences did the device wearer commit?', paths.INSTALLATION_AND_RISK.OFFENCE)
  }
}
