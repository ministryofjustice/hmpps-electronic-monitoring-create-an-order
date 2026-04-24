import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressListComponent from './addressListComponent'

export default class AddressListPage extends AppFormPage {
  public form = new AddressListComponent()

  constructor() {
    super("Device wearer's addresses", paths.POSTCODE_LOOKUP.ADDRESS_LIST)
  }
}
