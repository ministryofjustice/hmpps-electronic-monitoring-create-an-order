import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'
import FormFileUploadComponent from '../../formFileUploadComponent'

export type UploadAttachmentFormData = {
  file?: {
    fileName: string
    contents: string
  }
}

export default class UploadAttachmentFormComponent extends FormComponent {
  // FIELDS

  get uploadFieldLabel(): PageElement {
    return this.form.find('')
  }

  get uploadField(): FormFileUploadComponent {
    return new FormFileUploadComponent(this.form, 'Upload')
  }

  // FORM HELPERS

  fillInWith(profile: UploadAttachmentFormData): void {
    if (profile.file) {
      this.uploadField.uploadFile(profile.file)
    }
  }

  shouldBeValid(): void {
    this.uploadField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.uploadField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.uploadField.shouldNotBeDisabled()
  }

  get saveAndReturnButton(): PageElement {
    return this.form.contains('Save and return to main form menu')
  }
}
