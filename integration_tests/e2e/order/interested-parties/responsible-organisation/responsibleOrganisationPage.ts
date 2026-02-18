import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import ResponsibleOrganisationComponent from './responsibleOrganisationComponent'

export default class ResponsibleOrganisationPage extends AppFormPage {
  public form = new ResponsibleOrganisationComponent()

  constructor() {
    super('WIP Responsible Organisation', paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION)
  }
}
