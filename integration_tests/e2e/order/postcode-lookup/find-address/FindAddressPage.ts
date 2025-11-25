import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import FindAddressComponenet from './FindAddressComponent'

export default class FindAddressPage extends AppFormPage {
  public form = new FindAddressComponenet()

  constructor() {
    super('WIP Find Address', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
