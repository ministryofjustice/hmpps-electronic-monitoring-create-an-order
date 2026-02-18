import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OffenceType from './OffenceTypeComponent'

export default class OffenceTypePage extends AppFormPage {
  public form = new OffenceType()

  constructor() {
    super(
      'What type of acquisitive crime offence did the device wearer commit?',
      paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.OFFENCE_TYPE,
    )
  }
}
