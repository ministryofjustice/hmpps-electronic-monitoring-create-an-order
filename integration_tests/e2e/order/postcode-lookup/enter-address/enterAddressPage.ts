import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import EnterAddressComponet from './enterAddressComponent'

export default class EnterAddressPage extends AppFormPage {
  public form = new EnterAddressComponet()

  constructor() {
    super('WIP Enter Address ', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
