import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import NationalSecurityDirectorateComponent from './nationalSecurityDirectorateComponent'

export default class NationalSecurityDirectoratePage extends AppFormPage {
  public form = new NationalSecurityDirectorateComponent()

  constructor() {
    super('', paths.INTEREST_PARTIES.NSD, 'About the Notifying and Responsible Organisations')
  }
}
