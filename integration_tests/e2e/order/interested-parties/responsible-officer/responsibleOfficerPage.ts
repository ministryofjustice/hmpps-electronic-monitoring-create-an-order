import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ResponsibleOfficerComponent from './responsibleOfficerComponent'

export default class ResponsibleOfficerPage extends AppFormPage {
  public form = new ResponsibleOfficerComponent()

  constructor() {
    const helpText =
      "The Responsible Officer checks the device wearer follows the electornic monitoring order. For example, a Responsible Officer is the device wearer's proabtion officer"
    super(
      'Contact details for the Responsible Officer',
      paths.INTEREST_PARTIES.RESPONSIBLE_OFFICER,
      'About the Notifying and Responsible Organisation',
      helpText,
    )
  }
}
