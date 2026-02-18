import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import IsMappaComponent from './IsMappaComponent'

export default class IsMappaPage extends AppFormPage {
  public form = new IsMappaComponent()

  constructor() {
    const path = paths.INSTALLATION_AND_RISK.IS_MAPPA

    super('Is the device wearer a Multi-Agency Public Protection Arrangements (MAPPA) offender?', path)
  }
}
