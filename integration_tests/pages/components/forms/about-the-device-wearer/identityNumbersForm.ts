import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormSelectComponent from '../../formSelectComponent'

export type IdentityNumbersFormData = {
  personalId?: string
  // check this addition to see if it makes sense (personalId)
  pncId?: string
  nomisId?: string
  prisonNumber?: string
  deliusId?: string
  complianceAndEnforcementPersonReference?: string
  courtCaseReferenceNumber?: string
}

export default class IdentityNumbersFormComponent extends FormComponent {
  // FIELDS

  get personalIdField(): FormSelectComponent {
    const label = 'Select and enter all identity numbers that you have for the device wearer.'
    // need to figure out how to look for a hint rather than label here
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
    const label = 'Police National Computer (PNC)'
    return new FormInputComponent(this.form, label)
  }

  get nomisIdField(): FormInputComponent {
    const label = 'National Offender Management Information System (NOMIS)'
    return new FormInputComponent(this.form, label)
  }

  get prisonNumberField(): FormInputComponent {
    const label = 'Prison number'
    return new FormInputComponent(this.form, label)
  }

  get deliusIdField(): FormInputComponent {
    const label = 'NDelius ID'
    return new FormInputComponent(this.form, label)
  }

  get complianceAndEnforcementPersonReferenceField(): FormInputComponent {
    const label = 'Compliance and Enforcement Person Reference (CEPR)'
    return new FormInputComponent(this.form, label)
  }

  get courtCaseReferenceNumberField(): FormInputComponent {
    const label = 'Court Case Reference Number (CCRN)'
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith = (profile: IdentityNumbersFormData): void => {
    if (profile.personalId) {
      this.personalIdField.set(profile.personalId)
    }

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

    if (profile.complianceAndEnforcementPersonReference) {
      this.complianceAndEnforcementPersonReferenceField.set(profile.complianceAndEnforcementPersonReference)
    }

    if (profile.courtCaseReferenceNumber) {
      this.courtCaseReferenceNumberField.set(profile.courtCaseReferenceNumber)
    }
  }

  shouldBeValid(): void {
    this.personalIdField.shouldNotHaveValidationMessage()
    this.pncIdField.shouldNotHaveValidationMessage()
    this.pncIdField.shouldNotHaveValidationMessage()
    this.nomisIdField.shouldNotHaveValidationMessage()
    this.prisonNumberField.shouldNotHaveValidationMessage()
    this.deliusIdField.shouldNotHaveValidationMessage()
    this.complianceAndEnforcementPersonReferenceField.shouldNotHaveValidationMessage()
    this.courtCaseReferenceNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.personalIdField.shouldBeDisabled()
    this.pncIdField.shouldBeDisabled()
    this.nomisIdField.shouldBeDisabled()
    this.prisonNumberField.shouldBeDisabled()
    this.deliusIdField.shouldBeDisabled()
    this.complianceAndEnforcementPersonReferenceField.shouldBeDisabled()
    this.courtCaseReferenceNumberField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.personalIdField.shouldNotBeDisabled()
    this.pncIdField.shouldNotBeDisabled()
    this.nomisIdField.shouldNotBeDisabled()
    this.prisonNumberField.shouldNotBeDisabled()
    this.deliusIdField.shouldNotBeDisabled()
    this.complianceAndEnforcementPersonReferenceField.shouldNotBeDisabled()
    this.courtCaseReferenceNumberField.shouldNotBeDisabled()
  }
}
