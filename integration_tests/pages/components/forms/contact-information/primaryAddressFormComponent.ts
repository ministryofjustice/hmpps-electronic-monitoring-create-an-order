import AddressFormComponent from '../addressForm'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type PrimaryAddressFormData = {
  address?: {
    line1?: string
    line2?: string
    line3?: string
    line4?: string
    postcode?: string
  }
  isInstallAddress?: string
  monitorAnotherAddress?: string
}

export default class PrimaryAddressFormComponent extends AddressFormComponent {
  // FIELDS

  get isInstallAddressField(): FormRadiosComponent {
    const label = 'Is the primary address where the device will be installed?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get monitorAnotherAddressField(): FormRadiosComponent {
    const label = 'Does the device wearer have another address they will be monitored at?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // FORM HELPERS

  fillInWith(data: PrimaryAddressFormData): void {
    if (data.address) {
      this.fillAddressInWith(data.address)
    }

    if (data.isInstallAddress) {
      this.isInstallAddressField.set(data.isInstallAddress)
    }

    if (data.monitorAnotherAddress) {
      this.monitorAnotherAddressField.set(data.monitorAnotherAddress)
    }
  }

  shouldBeValid(): void {
    super.shouldBeValid()

    this.isInstallAddressField.shouldNotHaveValidationMessage()
    this.monitorAnotherAddressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    super.shouldBeDisabled()

    this.isInstallAddressField.shouldBeDisabled()
    this.monitorAnotherAddressField.shouldBeDisabled()
  }
}
