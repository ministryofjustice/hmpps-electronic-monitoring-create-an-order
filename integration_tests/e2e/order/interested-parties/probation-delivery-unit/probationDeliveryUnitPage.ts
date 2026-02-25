import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ProbationDeliveryUnitComponent from './probationDeliveryUnitComponent'

export default class ProbationDeliveryUnitPage extends AppFormPage {
  public form = new ProbationDeliveryUnitComponent()

  constructor() {
    super("What is the Responsible Organisation's Probation Delivery Unit (PDU)?", paths.INTEREST_PARTIES.PDU)
  }
}
