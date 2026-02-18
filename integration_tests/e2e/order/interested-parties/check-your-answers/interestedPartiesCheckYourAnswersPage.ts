import paths from '../../../../../server/constants/paths'
import AppFormPage from '../../../../pages/appFormPage'
import InterestedPartiesCheckYourAnswersComponent from './interestedPartiesCheckYourAnswersComponent'

export default class InterestedPartiesCheckYourAnswersPage extends AppFormPage {
  public form = new InterestedPartiesCheckYourAnswersComponent()

  constructor() {
    super('WIP Check Your Answers', paths.INTEREST_PARTIES.RESPONSBILE_ORGANISATION)
  }
}
