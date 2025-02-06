import AppPage from '../../appPage'

import { PageElement } from '../../page'

import paths from '../../../../server/constants/paths'
import AttachmentTask from '../../components/attachmentsTask'

export default class AttachmentSummaryPage extends AppPage {
  constructor() {
    super('Attach a document', paths.ATTACHMENT.ATTACHMENTS)
  }

  get licenceTask(): AttachmentTask {
    return new AttachmentTask('Licence')
  }

  get photoIdTask(): AttachmentTask {
    return new AttachmentTask('Photo ID')
  }

  get errorSummary(): PageElement {
    return cy.get('.govuk-error-summary')
  }

  get errorSummaryTitle(): PageElement {
    return this.errorSummary.find('.govuk-error-summary__title')
  }

  get errorList(): PageElement {
    return this.errorSummary.find('.govuk-error-summary__list')
  }

  // ACTIONS
  get saveAndReturnButton(): PageElement {
    return cy.contains('Save and return back to form section menu')
  }
}
