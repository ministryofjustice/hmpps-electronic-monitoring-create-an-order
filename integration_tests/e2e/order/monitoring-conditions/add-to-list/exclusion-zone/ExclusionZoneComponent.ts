import FormComponent from '../../../../../pages/components/formComponent'
import FormDateTimeComponent from '../../../../../pages/components/formDateTimeComponent'
import FormFileUploadComponent from '../../../../../pages/components/formFileUploadComponent'
import FormTextareaComponent from '../../../../../pages/components/formTextareaComponent'
import FormInputComponent from '../../../../../pages/components/formInputComponent'

export type EnforcementZoneFormData = {
  startDate?: Date
  endDate?: Date
  name?: string
  uploadFile?: {
    fileName: string
    contents: string
  }
  description?: string
  duration?: string
}

export default class EnforcementZoneFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'startDate')
  }

  get endDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'endDate')
  }

  get nameField(): FormInputComponent {
    return new FormInputComponent(this.form, 'What name would you give to the exclusion zone?')
  }

  get uploadField(): FormFileUploadComponent {
    return new FormFileUploadComponent(this.form, 'Monitoring zone map (optional)')
  }

  get descriptionField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'Where is the exclusion zone?')
  }

  get durationField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'When must the exclusion zone be followed?')
  }

  // FORM HELPERS

  fillInWith(data: EnforcementZoneFormData): void {
    if (data.startDate) {
      this.startDateField.set(data.startDate, false)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate, false)
    }

    if (data.name) {
      this.nameField.set(data.name)
    }

    if (data.uploadFile) {
      this.uploadField.uploadFile(data.uploadFile)
    }

    if (data.description) {
      this.descriptionField.set(data.description)
    }

    if (data.duration) {
      this.durationField.set(data.duration)
    }
  }

  shouldBeValid(): void {
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.nameField.shouldNotHaveValidationMessage()
    this.uploadField.shouldNotHaveValidationMessage()
    this.descriptionField.shouldNotHaveValidationMessage()
    this.durationField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.nameField.shouldBeDisabled()
    this.uploadField.shouldBeDisabled()
    this.descriptionField.shouldBeDisabled()
    this.durationField.shouldBeDisabled()
  }
}
