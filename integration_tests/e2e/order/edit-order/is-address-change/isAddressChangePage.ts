import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import IsAddressChangeFormComponent from './isAddressChangeFormComponent'

export default class IsAddressChangePage extends AppFormPage {
  public form = new IsAddressChangeFormComponent()

  constructor() {
    super(
      "Are you amending this form because the device wearer's primary address has changed?",
      paths.ORDER.IS_ADDRESS_CHANGE,
    )
  }
}
