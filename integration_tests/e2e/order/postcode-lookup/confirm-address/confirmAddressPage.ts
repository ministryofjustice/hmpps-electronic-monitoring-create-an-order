import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ConfirmAddressComponenet from './confirmAddressComponent'

export default class ConfirmAddressPage extends AppFormPage {
  public form = new ConfirmAddressComponenet()

  constructor() {
    super('WIP Confirm Address', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
