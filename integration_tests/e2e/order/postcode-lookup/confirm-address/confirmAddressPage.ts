import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ConfirmAddressComponent from './confirmAddressComponent'

export default class ConfirmAddressPage extends AppFormPage {
  public form = new ConfirmAddressComponent()

  constructor() {
    super('WIP Confirm Address', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
