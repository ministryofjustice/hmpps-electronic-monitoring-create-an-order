import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormSelectComponent from '../../formSelectComponent'

export type IdentityNumbersFormData = {
  pncId?: string
  nomisId?: string
  prisonNumber?: string
  deliusId?: string
  ceprId?: string
  ccrnId?: string
}

export default class IdentityNumbersFormComponent extends FormComponent {
  // FIELDS

  get personalIdField(): FormSelectComponent {
    const label = 'Select and enter all identity numbers that you have for the device wearer.'
    return new FormSelectComponent(this.form, label, [
      'Police National Computer (PNC)',
      'National Offender Management Information System (NOMIS)',
      'Prison number',
      'NDelius ID',
      'Compliance and Enforcement Person Reference (CEPR)',
      'Court Case Reference Number (CCRN)',
    ])
  }

  get pncIdField(): FormInputComponent {
    const label = 'Enter PNC'
    return new FormInputComponent(this.form, label)
  }

  get nomisIdField(): FormInputComponent {
    const label = 'Enter NOMIS'
    return new FormInputComponent(this.form, label)
  }

  get prisonNumberField(): FormInputComponent {
    const label = 'Enter prison number'
    return new FormInputComponent(this.form, label)
  }

  get deliusIdField(): FormInputComponent {
    const label = 'Enter NDelius ID'
    return new FormInputComponent(this.form, label)
  }

  get ceprIdField(): FormInputComponent {
    const label = 'Enter CEPR'
    return new FormInputComponent(this.form, label)
  }

  get ccrnIdField(): FormInputComponent {
    const label = 'Enter CCRN'
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith = (profile: IdentityNumbersFormData): undefined => {
    if (profile.pncId) {
      this.pncIdField.set(profile.pncId)
    }

    if (profile.nomisId) {
      this.nomisIdField.set(profile.nomisId)
    }

    if (profile.prisonNumber) {
      this.prisonNumberField.set(profile.prisonNumber)
    }

    if (profile.deliusId) {
      this.deliusIdField.set(profile.deliusId)
    }

    if (profile.ceprId) {
      this.ceprIdField.set(profile.ceprId)
    }

    if (profile.ccrnId) {
      this.ccrnIdField.set(profile.ccrnId)
    }
  }

  shouldBeValid(): void {
    this.pncIdField.shouldNotHaveValidationMessage()
    this.nomisIdField.shouldNotHaveValidationMessage()
    this.prisonNumberField.shouldNotHaveValidationMessage()
    this.deliusIdField.shouldNotHaveValidationMessage()
    this.ceprIdField.shouldNotHaveValidationMessage()
    this.ccrnIdField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.pncIdField.shouldBeDisabled()
    this.nomisIdField.shouldBeDisabled()
    this.prisonNumberField.shouldBeDisabled()
    this.deliusIdField.shouldBeDisabled()
    this.ceprIdField.shouldBeDisabled()
    this.ccrnIdField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.pncIdField.shouldNotBeDisabled()
    this.nomisIdField.shouldNotBeDisabled()
    this.prisonNumberField.shouldNotBeDisabled()
    this.deliusIdField.shouldNotBeDisabled()
    this.ceprIdField.shouldNotBeDisabled()
    this.ccrnIdField.shouldNotBeDisabled()
  }
}
