import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import OtherRisksComponent, { OTHER_RISKS_QUESTION } from './OtherRisksComponent'

export default class OtherRisksPage extends AppFormPage {
  public form = new OtherRisksComponent()

  constructor() {
    super(OTHER_RISKS_QUESTION, paths.INSTALLATION_AND_RISK.OTHER_RISKS)
  }
}
