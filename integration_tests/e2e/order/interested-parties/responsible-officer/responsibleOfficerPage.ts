import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ResponsibleOfficerComponent from './responsibleOfficerComponent'

export default class ResponsibleOfficerPage extends AppFormPage {
  public form = new ResponsibleOfficerComponent()

  constructor() {
    super('WIP Responsible Officer', paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER)
  }
}
