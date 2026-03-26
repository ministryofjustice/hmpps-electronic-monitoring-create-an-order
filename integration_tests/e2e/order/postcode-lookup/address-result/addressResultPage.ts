import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import AddressResultComponent from './addressResultComponent'

export default class AddressResultPage extends AppFormPage {
  public form = new AddressResultComponent()

  constructor() {
    super(/(Select the .* address) | (No results found)/gm, paths.POSTCODE_LOOKUP.ADDRESS_RESULT)
  }
}
