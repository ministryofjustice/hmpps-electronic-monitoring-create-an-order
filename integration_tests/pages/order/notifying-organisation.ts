import paths from '../../../server/constants/paths'
import NotifyingOrganisationComponent from '../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationComponent'
import AppFormPage from '../appFormPage'

export default class OrderNotifyingOrganisationPage extends AppFormPage {
  public form = new NotifyingOrganisationComponent()

  constructor() {
    super('Your details', paths.ORDER.NOTIFYING_ORGANISATION)
  }
}
