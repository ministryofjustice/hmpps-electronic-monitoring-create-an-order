import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'

export type AlcoholMonitoringFormData = {
  isPartOfACP?: string
  isPartOfDAPOL?: string
  orderType?: string
  monitoringType?: string
  startDate?: Date
  endDate?: Date
  installLocation?: string
}

export default class AlcoholMonitoringFormComponent extends FormComponent {
  // FIELDS

  get isPartOfACPField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is the device wearer part of the Acquisitive Crime project ? (optional)',
      ['Yes', 'No'],
    )
  }

  get isPartOfDAPOLField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is the device wearer part of the Domestic Abuse Perpetrators on Licence(DAPOL) project ? (optional)',
      ['Yes', 'No'],
    )
  }

  get orderTypeField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'Select order type', [
      'Civil',
      'Community',
      'Immigration',
      'Post Release',
      'Pre-Trial',
      'Special',
    ])
  }

  get monitoringTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What type of alcohol monitoring is needed?', [
      'Alcohol level',
      'Alcohol abstinence',
    ])
  }

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Start date of alcohol monitoring')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'End date of alcohol monitoring')
  }

  get installLocationField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Where will alcohol monitoring equipment installation take place?', [
      /at Installation Address/,
      /at Primary Address/,
      /at Secondary Address/,
      /at Tertiary Address/,
      'at the probation office',
      'at prison',
    ])
  }

  get probationNameField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter probation office name')
  }

  get prisonNameField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter prison name')
  }

  // FORM HELPERS

  fillInWith(data: AlcoholMonitoringFormData): void {
    if (data.isPartOfACP) {
      this.isPartOfACPField.set(data.isPartOfACP)
    }

    if (data.isPartOfDAPOL) {
      this.isPartOfDAPOLField.set(data.isPartOfDAPOL)
    }

    if (data.orderType) {
      this.orderTypeField.set(data.orderType)
    }

    if (data.monitoringType) {
      this.monitoringTypeField.set(data.monitoringType)
    }

    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }

    if (data.installLocation) {
      this.installLocationField.set(data.installLocation)
    }

    // agreed address

    // probation office name

    // prison name
  }

  shouldBeValid(): void {
    this.isPartOfACPField.shouldNotHaveValidationMessage()
    this.isPartOfDAPOLField.shouldNotHaveValidationMessage()
    this.orderTypeField.shouldNotHaveValidationMessage()
    this.monitoringTypeField.shouldNotHaveValidationMessage()
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.installLocationField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.isPartOfACPField.shouldBeDisabled()
    this.isPartOfDAPOLField.shouldBeDisabled()
    this.orderTypeField.shouldBeDisabled()
    this.monitoringTypeField.shouldBeDisabled()
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.installLocationField.shouldBeDisabled()
  }
}
