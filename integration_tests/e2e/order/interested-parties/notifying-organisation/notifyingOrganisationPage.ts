import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import NotifyingOrganisationComponent from './notifyingOrganisationComponent'

export default class NotifyingOrganisationPage extends AppFormPage {
  public form = new NotifyingOrganisationComponent()

  constructor() {
    super("Notifying Organisation's details", paths.INTEREST_PARTIES.NOTIFYING_ORGANISATION)
  }
}
