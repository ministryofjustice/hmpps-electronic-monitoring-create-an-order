import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'

export type IdentityNumbersFormData = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string
  homeOfficeReferenceNumber?: string
}

export default class IdentityNumbersFormComponent extends FormComponent {
  // FIELDS

  get nomisIdField(): FormInputComponent {
    const label = 'National Offender Management Information System (NOMIS) ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get pncIdField(): FormInputComponent {
    const label = 'Police National Computer (PNC) ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get deliusIdField(): FormInputComponent {
    const label = 'Delius ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get prisonNumberField(): FormInputComponent {
    const label = 'Prison Number (Optional)'
    return new FormInputComponent(this.form, label)
  }

  get homeOfficeReferenceNumberField(): FormInputComponent {
    const label = 'Home Office Reference Number (Optional)'
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith = (profile: IdentityNumbersFormData): undefined => {
    if (profile.nomisId) {
      this.nomisIdField.set(profile.nomisId)
    }

    if (profile.pncId) {
      this.pncIdField.set(profile.pncId)
    }

    if (profile.deliusId) {
      this.deliusIdField.set(profile.deliusId)
    }

    if (profile.prisonNumber) {
      this.prisonNumberField.set(profile.prisonNumber)
    }

    if (profile.homeOfficeReferenceNumber) {
      this.homeOfficeReferenceNumberField.set(profile.homeOfficeReferenceNumber)
    }
  }

  shouldBeValid(): void {
    this.nomisIdField.shouldNotHaveValidationMessage()
    this.pncIdField.shouldNotHaveValidationMessage()
    this.deliusIdField.shouldNotHaveValidationMessage()
    this.prisonNumberField.shouldNotHaveValidationMessage()
    this.homeOfficeReferenceNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.nomisIdField.shouldBeDisabled()
    this.pncIdField.shouldBeDisabled()
    this.deliusIdField.shouldBeDisabled()
    this.prisonNumberField.shouldBeDisabled()
    this.homeOfficeReferenceNumberField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.nomisIdField.shouldNotBeDisabled()
    this.pncIdField.shouldNotBeDisabled()
    this.deliusIdField.shouldNotBeDisabled()
    this.prisonNumberField.shouldNotBeDisabled()
    this.homeOfficeReferenceNumberField.shouldNotBeDisabled()
  }
}
