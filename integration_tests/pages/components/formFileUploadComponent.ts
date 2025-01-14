import { v4 as uuidv4 } from 'uuid'

import { PageElement } from '../page'

export type UploadFileOptions = {
  fileName: string
  contents: string
}

export default class FormFileUploadComponent {
  private elementCacheId: string = uuidv4()

  constructor(
    private readonly parent: PageElement,
    private readonly label: string,
  ) {
    this.parent.getByLabel(this.label, { log: false }).as(`${this.elementCacheId}-element`)

    this.element.should('exist')
  }

  get element(): PageElement {
    return cy.get(`@${this.elementCacheId}-element`, { log: false })
  }

  uploadFile(options: UploadFileOptions): void {
    this.element.selectFile({
      contents: Cypress.Buffer.from(options.contents),
      fileName: options.fileName,
      lastModified: Date.now(),
    })
  }

  shouldHaveValue(value?: string | number | boolean): void {
    this.element.should('have.value', value as string)
  }

  shouldBeDisabled(): void {
    this.element.should('be.disabled')
  }

  shouldNotBeDisabled(): void {
    this.element.should('not.be.disabled')
  }

  get validationMessage(): PageElement {
    return this.element.siblings('.govuk-error-message', { log: false })
  }

  shouldHaveValidationMessage(message: string): void {
    this.validationMessage.should('contain', message)
  }

  shouldNotHaveValidationMessage(): void {
    this.validationMessage.should('not.exist')
  }
}
