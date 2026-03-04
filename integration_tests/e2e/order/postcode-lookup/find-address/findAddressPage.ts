import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import FindAddressComponent from './findAddressComponent'

export default class FindAddressPage extends AppFormPage {
  public form = new FindAddressComponent()

  constructor() {
    super("Find the device wearer's address", paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
