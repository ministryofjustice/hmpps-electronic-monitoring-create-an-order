import FormComponent from '../../formComponent'
import FormTextareaComponent from '../../formTextareaComponent'
import FormDateComponent from '../../formDateComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormFileUploadComponent from '../../formFileUploadComponent'

export type EnforcementZoneFormData = {
  zoneType?: string
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

  get zoneTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Is monitoring for an exclusion or inclusion zone?', [
      'Exclusion zone',
      'Inclusion zone',
    ])
  }

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring starts.')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring ends. (optional)')
  }

  get uploadField(): FormFileUploadComponent {
    return new FormFileUploadComponent(this.form, 'Upload map')
  }

  get descriptionField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'Monitoring zone description')
  }

  get durationField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, 'Monitoring zone duration')
  }

  get anotherZoneField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Add another exclusion or inclusion zone?', ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(data: EnforcementZoneFormData): void {
    if (data.zoneType) {
      this.zoneTypeField.set(data.zoneType)
    }

    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
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
    this.zoneTypeField.shouldNotHaveValidationMessage()
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.uploadField.shouldNotHaveValidationMessage()
    this.descriptionField.shouldNotHaveValidationMessage()
    this.durationField.shouldNotHaveValidationMessage()
    this.anotherZoneField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.zoneTypeField.shouldBeDisabled()
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.uploadField.shouldBeDisabled()
    this.descriptionField.shouldBeDisabled()
    this.durationField.shouldBeDisabled()

    // TODO: this fails when we attempt to create the Component wrapper so we have to do it a different way
    // this.anotherZoneField.shouldBeDisabled()
    cy.contains('legend', 'Add another exclusion or inclusion zone?', { log: false }).should('not.exist')
  }
}
