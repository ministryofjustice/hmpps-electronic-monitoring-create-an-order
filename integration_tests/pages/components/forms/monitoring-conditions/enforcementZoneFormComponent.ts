import FormComponent from '../../formComponent'
import FormTextareaComponent from '../../formTextareaComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormFileUploadComponent from '../../formFileUploadComponent'
import FormDateTimeComponent from '../../formDateTimeComponent'

export type EnforcementZoneFormData = {
  startDate?: Date
  endDate?: Date
  uploadFile?: {
    fileName: string
    contents: string
  }
  description?: string
  duration?: string
  anotherZone?: string
}

export default class EnforcementZoneFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'startDate')
  }

  get endDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'endDate')
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

  get anotherZoneField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Do you need to add another exclusion zone?', ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(data: EnforcementZoneFormData): void {
    if (data.startDate) {
      this.startDateField.set(data.startDate, false)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate, false)
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

    if (data.anotherZone) {
      this.anotherZoneField.set(data.anotherZone)
    }
  }

  shouldBeValid(): void {
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.uploadField.shouldNotHaveValidationMessage()
    this.descriptionField.shouldNotHaveValidationMessage()
    this.durationField.shouldNotHaveValidationMessage()
    this.anotherZoneField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.uploadField.shouldBeDisabled()
    this.descriptionField.shouldBeDisabled()
    this.durationField.shouldBeDisabled()

    // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
    // this.anotherZoneField.shouldBeDisabled()
    cy.contains('legend', 'Add another exclusion or inclusion zone?', { log: false }).should('not.exist')
  }

  shouldHaveAllOptions(): void {
    this.anotherZoneField.shouldHaveAllOptions()
  }
}
