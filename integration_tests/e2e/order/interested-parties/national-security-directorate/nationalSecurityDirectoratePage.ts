import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import NationalSecurityDirectorateComponent from './nationalSecurityDirectorateComponent'

export default class NationalSecurityDirectoratePage extends AppFormPage {
  public form = new NationalSecurityDirectorateComponent()

  constructor() {
    super(
      'Is the device wearer being managed by the National Security Directorate (NSD)?',
      paths.INTEREST_PARTIES.NSD,
      'About the Responsible Organisation',
    )
  }
}
