import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ConfirmAddressComponet from './confirmAddressComponent'

export default class ConfirmAddressPage extends AppFormPage {
  public form = new ConfirmAddressComponet()

  constructor() {
    super('WIP Confirm Address', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
