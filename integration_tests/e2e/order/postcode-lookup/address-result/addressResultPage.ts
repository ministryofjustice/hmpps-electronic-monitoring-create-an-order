import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressResultComponet from './addressResultComponent'

export default class AddressResultPage extends AppFormPage {
  public form = new AddressResultComponet()

  constructor() {
    super('WIP Address Result', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
