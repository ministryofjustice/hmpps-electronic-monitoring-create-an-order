import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import DapoComponent from './dapoComponent'

export default class DapoPage extends AppFormPage {
  public form = new DapoComponent()

  constructor() {
    super('WIP Dapo and dates', paths.INSTALLATION_AND_RISK.DAPO)
  }
}
