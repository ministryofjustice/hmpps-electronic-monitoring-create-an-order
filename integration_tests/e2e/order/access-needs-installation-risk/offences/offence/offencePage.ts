import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceComponent from './offenceComponent'

export default class OffencePage extends AppFormPage {
  public form = new OffenceComponent()

  constructor() {
    super('Offence details', paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM)
  }
}
