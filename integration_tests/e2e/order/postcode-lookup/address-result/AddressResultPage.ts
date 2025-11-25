import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressResultComponenet from './AddressResultComponent'

export default class AddressResultPage extends AppFormPage {
  public form = new AddressResultComponenet()

  constructor() {
    super('WIP Address Result', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
