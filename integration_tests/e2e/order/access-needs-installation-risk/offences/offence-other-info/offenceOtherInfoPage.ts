import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceOtherInfoComponent from './offenceOtherInfoComponent'

export type OffenceOtherInfoInput = {
  isAdditionalInfo?: string
}
export default class OffenceOtherInfoPage extends AppFormPage {
  public form = new OffenceOtherInfoComponent()

  constructor() {
    super(
      'Is there any other information to be aware of about the offence committed?',
      paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO,
    )
  }
}
