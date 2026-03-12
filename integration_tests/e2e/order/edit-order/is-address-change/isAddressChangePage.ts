import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import IsAddressChangeFormComponent from './isAddressChangeFormComponent'

export default class IsAddressChangePage extends AppFormPage {
  public form = new IsAddressChangeFormComponent()

  constructor() {
    super('', paths.ORDER.IS_ADDRESS_CHANGE)
  }
}
