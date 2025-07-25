import FormCheckboxesComponent from '../formCheckboxesComponent'
import FormComponent from '../formComponent'
import FormSelectComponent from '../formSelectComponent'
import FormDateTimeComponent from '../formDateTimeComponent'
import FormRadiosComponent from '../formRadiosComponent'

export type MonitoringConditionsFormData = {
  orderType?: string
  monitoringRequired?: string | string[]
  orderTypeDescription?: string
  conditionType?: string
  startDate?: Date
  endDate?: Date
  sentenceType?: string
  issp?: string
  hdc?: string
  prarr?: string
  pilot?: string
}

export default class MonitoringConditionsFormComponent extends FormComponent {
  // FIELDS

  get orderTypeField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'What is the order type?', [
      'Civil',
      'Community',
      'Immigration',
      'Post Release',
      'Pre-Trial',
      'Special',
    ])
  }

  get orderTypeDescriptionField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What pilot project is the device wearer part of?', [
      'Domestic Abuse Perpetrator on Licence (DAPOL)',
      'Domestic Abuse Perpetrator on Licence Home Detention Curfew (DAPOL HDC)',
      'GPS Acquisitive Crime Home Detention Curfew',
      'GPS Acquisitive Crime',
      'They are not part of any of these pilots',
    ])
  }

  get pilotField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'What pilot project is the device wearer part of? (optional)', [
      'Domestic Abuse Perpetrator on Licence (DAPOL)',
      'Domestic Abuse Perpetrator on Licence Home Detention Curfew (DAPOL HDC)',
      'Domestic Abuse Perpetrator on Licence Project',
      'GPS Acquisitive Crime Home Detention Curfew',
      'GPS Acquisitive Crime Parole',
      'Acquisitive Crime Project',
      'Licence Variation Project',
    ])
  }

  get conditionTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What condition is the monitoring part of?', [
      'Licence condition',
      'Post-Sentence Supervision Requirement',
    ])
  }

  get monitoringRequiredField(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'What monitoring does the device wearer need?', [
      'Curfew',
      'Exclusion zone monitoring',
      'Trail monitoring',
      'Mandatory attendance monitoring',
      'Alcohol monitoring',
    ])
  }

  get startDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'startDate')
  }

  get endDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'endDate')
  }

  get sentenceTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What type of sentence has the device wearer been given?', [
      'Extended Determinate Sentence',
      'Imprisonment for Public Protection (IPP)',
      'Life Sentence',
      'Section 236A Special Custodial Sentences for Offenders of Particular Concern (SOPC)',
      'Section 227/228 Extended Sentence for Public Protection (EPP)',
      'Section 85 Extended Sentences',
      'Standard Determinate Sentence',
      'Detention and Training Order (DTO)',
    ])
  }

  get isspField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is the device wearer on the Intensive Supervision and Surveillance Programme (ISSP)?',
      ['Yes', 'No', 'Not able to provide this information'],
    )
  }

  get hdcField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Is the device wearer on a Home Detention Curfew (HDC)?', [
      'Yes',
      'No',
      'Not able to provide this information',
    ])
  }

  get prarrField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Has the device wearer been released on a Presumptive Risk Assessed Release Review (P-RARR)?',
      ['Yes', 'No', 'Not able to provide this information'],
    )
  }

  // FORM HELPERS

  fillInWith(data: MonitoringConditionsFormData): void {
    if (data.orderType) {
      this.orderTypeField.set(data.orderType)
    }

    if (data.monitoringRequired) {
      this.monitoringRequiredField.set(data.monitoringRequired)
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

    if (data.sentenceType) {
      this.sentenceTypeField.set(data.sentenceType)
    }

    if (data.issp) {
      this.isspField.set(data.issp)
    }

    if (data.hdc) {
      this.hdcField.set(data.hdc)
    }

    if (data.prarr) {
      this.prarrField.set(data.prarr)
    }

    if (data.pilot) {
      this.pilotField.set(data.pilot)
    }
  }

  shouldBeValid(): void {
    this.orderTypeField.shouldNotHaveValidationMessage()
    this.monitoringRequiredField.shouldNotHaveValidationMessage()
    this.pilotField.shouldNotHaveValidationMessage()
    this.conditionTypeField.shouldNotHaveValidationMessage()
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.sentenceTypeField.shouldNotHaveValidationMessage()
    this.isspField.shouldNotHaveValidationMessage()
    this.hdcField.shouldNotHaveValidationMessage()
    this.prarrField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.orderTypeField.shouldBeDisabled()
    this.monitoringRequiredField.shouldBeDisabled()
    this.pilotField.shouldBeDisabled()
    this.conditionTypeField.shouldBeDisabled()
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.sentenceTypeField.shouldBeDisabled()
    this.isspField.shouldBeDisabled()
    this.hdcField.shouldBeDisabled()
    this.prarrField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.orderTypeField.shouldNotBeDisabled()
    this.monitoringRequiredField.shouldNotBeDisabledWithException('value', 'alcohol')
    this.pilotField.shouldNotBeDisabled()
    this.conditionTypeField.shouldNotBeDisabled()
    this.startDateField.shouldNotBeDisabled()
    this.endDateField.shouldNotBeDisabled()
    this.sentenceTypeField.shouldNotBeDisabled()
    this.isspField.shouldNotBeDisabled()
    this.hdcField.shouldNotBeDisabled()
    this.prarrField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.orderTypeField.shouldHaveAllOptions()
    this.pilotField.shouldHaveAllOptions()
    this.conditionTypeField.shouldHaveAllOptions()
    this.monitoringRequiredField.shouldHaveAllOptions()
    this.sentenceTypeField.shouldHaveAllOptions()
    this.isspField.shouldHaveAllOptions()
    this.hdcField.shouldHaveAllOptions()
    this.prarrField.shouldHaveAllOptions()
  }
}
