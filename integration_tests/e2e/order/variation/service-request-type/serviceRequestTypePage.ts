import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ServiceRequestTypeComponent from './serviceRequestTypeComponent'

export default class ServiceRequestTypePage extends AppFormPage {
  public form = new ServiceRequestTypeComponent()

  constructor() {
    super('Why are you making changes to the form?', paths.VARIATION.SERVICE_REQUEST_TYPE)
  }
}
