import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import FindAddressComponet from './findAddressComponent'

export default class FindAddressPage extends AppFormPage {
  public form = new FindAddressComponet()

  constructor() {
    super('WIP Find Address', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
