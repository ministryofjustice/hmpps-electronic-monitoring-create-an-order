import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressResultComponent from './addressResultComponent'

export default class AddressResultPage extends AppFormPage {
  public form = new AddressResultComponent()

  constructor() {
    super("Select the device wearer's address", paths.POSTCODE_LOOKUP.ADDRESS_RESULT)
  }
}
