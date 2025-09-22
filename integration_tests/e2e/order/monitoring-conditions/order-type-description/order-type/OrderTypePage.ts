import paths from '../../../../../../server/constants/paths'
import AppFormPage from '../../../../../pages/appFormPage'
import OrderTypeComponent from './OrderTypeComponent'

export default class OrderTypePage extends AppFormPage {
  public form = new OrderTypeComponent()

  constructor() {
    super('', `${paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION}/order-type`)
  }
}
