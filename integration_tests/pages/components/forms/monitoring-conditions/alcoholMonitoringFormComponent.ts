import FormComponent from '../../formComponent'
import FormDateTimeComponent from '../../formDateTimeComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type AlcoholMonitoringFormData = {
  isPartOfACP?: string
  isPartOfDAPOL?: string
  orderType?: string
  monitoringType?: string
  startDate?: Date
  endDate?: Date
  installLocation?: string | RegExp
}

export default class AlcoholMonitoringFormComponent extends FormComponent {
  // FIELDS

  get monitoringTypeField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What alcohol monitoring does the device wearer need?', [
      'Alcohol level',
      'Alcohol abstinence',
    ])
  }

  get startDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'startDate')
  }

  get endDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'endDate')
  }

  // FORM HELPERS

  fillInWith(data: AlcoholMonitoringFormData): void {
    if (data.monitoringType) {
      this.monitoringTypeField.set(data.monitoringType)
    }
    if (data.startDate) {
      this.startDateField.set(data.startDate, false)
    }
    if (data.endDate) {
      this.endDateField.set(data.endDate, false)
    }
    // agreed address
    // probation office name
    // prison name
  }

  shouldBeValid(): void {
    this.monitoringTypeField.shouldNotHaveValidationMessage()
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.monitoringTypeField.shouldBeDisabled()
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.monitoringTypeField.shouldNotBeDisabled()
    this.startDateField.shouldNotBeDisabled()
    this.endDateField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.monitoringTypeField.shouldHaveAllOptions()
  }
}
