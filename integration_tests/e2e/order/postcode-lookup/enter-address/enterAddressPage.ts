import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import EnterAddressComponent from './enterAddressComponent'

export default class EnterAddressPage extends AppFormPage {
  public form = new EnterAddressComponent()

  constructor() {
    super('address', paths.POSTCODE_LOOKUP.ENTER_ADDRESS)
  }
}
