import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressResultComponent from './addressResultComponent'

export default class AddressResultPage extends AppFormPage {
  public form = new AddressResultComponent()

  constructor() {
    super('WIP Address Result', paths.POSTCODE_LOOKUP.FIND_ADDRESS)
  }
}
