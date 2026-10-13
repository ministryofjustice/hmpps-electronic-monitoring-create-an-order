import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import OtherRisksComponent from './OtherRisksComponent'

export default class OtherRisksPage extends AppFormPage {
  public form = new OtherRisksComponent()

  constructor() {
    super('WIP Other risks', paths.INSTALLATION_AND_RISK.OTHER_RISKS)
  }
}
