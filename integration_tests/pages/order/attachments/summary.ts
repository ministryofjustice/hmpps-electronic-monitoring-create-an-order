import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'
import SummaryListComponentWithoutHeading from '../../components/SummaryListComponentWithoutHeading'
import CheckYourAnswersPage from '../../checkYourAnswersPage'
import ErrorSummaryComponent from '../../components/errorSummaryComponent'

export default class AttachmentSummaryPage extends CheckYourAnswersPage {
  constructor(heading: string = 'Check your answers', isOldVersion: boolean = false) {
    let path: string
    if (isOldVersion) {
      path = paths.ATTACHMENT.BASE_URL_VERSION
    } else {
      path = paths.ATTACHMENT.BASE_URL
    }

    super(heading, path, 'Additional documents')
  }

  get errorSummary(): ErrorSummaryComponent {
    return new ErrorSummaryComponent()
  }

  get attachmentsSection(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }

  // ACTIONS
  get saveAndReturnButton(): PageElement {
    return cy.contains('Save and return to main form menu')
  }

  saveAndReturn() {
    this.saveAndReturnButton.click()
  }
}
