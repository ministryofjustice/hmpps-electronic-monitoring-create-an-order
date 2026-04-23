import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ConfirmAddressComponent from './confirmAddressComponent'

export default class ConfirmAddressPage extends AppFormPage {
  public form = new ConfirmAddressComponent()

  constructor() {
    super(/Confirm the .* address/, paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS)
  }
}
