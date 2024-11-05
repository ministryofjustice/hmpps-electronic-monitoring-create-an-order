import FormCheckboxesComponent from '../formCheckboxesComponent'
import FormComponent from '../formComponent'
import FormRadiosComponent from '../formRadiosComponent'
import FormSelectComponent from '../formSelectComponent'
import FormDateComponent from '../formDateComponent'

export type MonitoringConditionsFormData = {
  isPartOfACP?: string
  isPartOfDAPOL?: string
  orderType?: string
  monitoringRequired?: string | string[]
  devicesRequired?: string | string[]
  orderTypeDescription?: string
  conditionType?: string
  startDate?: Date
  endDate?: Date
}

export default class MonitoringConditionsFormComponent extends FormComponent {
  // FIELDS

  get isPartOfACPField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is the device wearer part of the Acquisitive Crime project? (optional)',
      ['Yes', 'No'],
    )
  }

  get isPartOfDAPOLField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is the device wearer part of the Domestic Abuse Perpetrators on Licence (DAPOL) project? (optional)',
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

  get orderTypeDescriptionField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'Select order type description', [
      'DAPOL',
      'DAPOL HDC',
      'GPS Acquisitive Crime HDC',
      'GPS Acquisitive Crime Parole',
    ])
  }

  get conditionTypeField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'Select condition type', [
      'Requirement of a Community Order',
      'License Condition of a Custodial Order',
      'Post-Sentence Supervision Requirement following on from an Adult Custody order',
      'Bail Order',
    ])
  }

  get monitoringRequiredField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'Monitoring required', [
      'Curfew with electronic monitoring',
      'Exclusion and inclusion zone monitoring',
      'Trail monitoring',
      'Mandatory attendance monitoring',
      'Alcohol monitoring',
    ])
  }

  get devicesRequiredField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'Devices required', [
      'Location, fitted',
      'Location, not fitted',
      'Radio frequency',
      'Alcohol, transdermal',
      'Alcohol, remote breath',
    ])
  }

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring starts')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'Enter the date for when monitoring ends (optional)')
  }

  // FORM HELPERS

  fillInWith(data: MonitoringConditionsFormData): void {
    if (data.isPartOfACP) {
      this.isPartOfACPField.set(data.isPartOfACP)
    }

    if (data.isPartOfDAPOL) {
      this.isPartOfDAPOLField.set(data.isPartOfDAPOL)
    }

    if (data.orderType) {
      this.orderTypeField.set(data.orderType)
    }

    if (data.monitoringRequired) {
      this.monitoringRequiredField.set(data.monitoringRequired)
    }

    if (data.devicesRequired) {
      this.devicesRequiredField.set(data.devicesRequired)
    }

    if (data.orderTypeDescription) {
      this.orderTypeDescriptionField.set(data.orderTypeDescription)
    }

    if (data.conditionType) {
      this.conditionTypeField.set(data.conditionType)
    }

    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }
  }

  shouldBeValid(): void {
    this.isPartOfACPField.shouldNotHaveValidationMessage()
    this.isPartOfDAPOLField.shouldNotHaveValidationMessage()
    this.orderTypeField.shouldNotHaveValidationMessage()
    this.monitoringRequiredField.shouldNotHaveValidationMessage()
    this.devicesRequiredField.shouldNotHaveValidationMessage()
    this.orderTypeDescriptionField.shouldNotHaveValidationMessage()
    this.conditionTypeField.shouldNotHaveValidationMessage()
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.isPartOfACPField.shouldBeDisabled()
    this.isPartOfDAPOLField.shouldBeDisabled()
    this.orderTypeField.shouldBeDisabled()
    this.monitoringRequiredField.shouldBeDisabled()
    this.devicesRequiredField.shouldBeDisabled()
    this.orderTypeDescriptionField.shouldBeDisabled()
    this.conditionTypeField.shouldBeDisabled()
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
  }
}
