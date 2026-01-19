import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import DapoComponent from './DapoComponent'

export default class DapoPage extends AppFormPage {
  public form = new DapoComponent()

  constructor(clauseId?: boolean) {
    let path = paths.INSTALLATION_AND_RISK.DAPO
    if (clauseId) {
      path = paths.INSTALLATION_AND_RISK.DAPO_ID
    }
    super('Add DAPO order clause', path)
  }
}
