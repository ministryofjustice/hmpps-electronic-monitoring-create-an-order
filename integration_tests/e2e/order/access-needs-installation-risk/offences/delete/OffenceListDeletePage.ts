import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceListDeleteComponent from './OffenceListDeleteComponent'

export default class OffenceListDeletePage extends AppFormPage {
  public form = new OffenceListDeleteComponent()

  constructor() {
    super('WIP Delete', paths.INSTALLATION_AND_RISK.DELETE)
  }
}
