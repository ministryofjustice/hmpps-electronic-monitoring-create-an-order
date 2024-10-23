import FormCheckboxesComponent from '../formCheckboxesComponent'
import FormComponent from '../formComponent'
import FormRadiosComponent from '../formRadiosComponent'
import FormSelectComponent from '../formSelectComponent'

export type MonitoringConditionsFormData = {
  isPartOfACP?: string
  isPartOfDAPOL?: string
  orderType?: string
  monitoringRequired?: string | string[]
  devicesRequired?: string | string[]
}

export default class MonitoringConditionsFormComponent extends FormComponent {
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
  }

  shouldBeValid(): void {
    this.isPartOfACPField.shouldNotHaveValidationMessage()
    this.isPartOfDAPOLField.shouldNotHaveValidationMessage()
    this.orderTypeField.shouldNotHaveValidationMessage()
    this.monitoringRequiredField.shouldNotHaveValidationMessage()
    this.devicesRequiredField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.isPartOfACPField.shouldBeDisabled()
    this.isPartOfDAPOLField.shouldBeDisabled()
    this.orderTypeField.shouldBeDisabled()
    this.monitoringRequiredField.shouldBeDisabled()
    this.devicesRequiredField.shouldBeDisabled()
  }
}
