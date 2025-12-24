import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import HaveGrantOfBailFormComponent from './haveGrantOfBailFormComponent'

export default class HaveGrantOfBailPage extends AppFormPage {
  public form = new HaveGrantOfBailFormComponent()

  constructor() {
    super('', paths.ATTACHMENT.HAVE_GRANT_OF_BAIL)
  }
}
