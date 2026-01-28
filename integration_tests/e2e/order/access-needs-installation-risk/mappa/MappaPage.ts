import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import MappaComponent from './MappaComponent'

export default class MappaPage extends AppFormPage {
  public form = new MappaComponent()

  constructor() {
    const path = paths.INSTALLATION_AND_RISK.MAPPA

    super('MAPPA', path)
  }
}
