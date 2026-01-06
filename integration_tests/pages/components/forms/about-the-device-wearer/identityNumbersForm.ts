import FormCheckboxesComponent from '../../formCheckboxesComponent'
import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'

export type IdentityNumbersFormData = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string
  complianceAndEnforcementPersonReference?: string
  courtCaseReferenceNumber?: string
}

export default class IdentityNumbersFormComponent extends FormComponent {
  get checkboxes(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, 'What identity numbers do you have for the device wearer?', [
      'National Offender Management Information System (NOMIS)',
      'Police National Computer (PNC)',
      'Prison Number',
      'NDelius ID',
      'Compliance and Enforcement Person Reference (CEPR)',
      'Court Case Reference Number (CCRN)',
    ])
  }
  // FIELDS

  get nomisIdField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter NOMIS ID')
  }

  get pncIdField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter PNC')
  }

  get deliusIdField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter NDelius ID')
  }

  get prisonNumberField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter Prison Number')
  }

  get complianceField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter Compliance and Enforcement Person Reference')
  }

  get courtCaseField(): FormInputComponent {
    return new FormInputComponent(this.form, 'Enter Court Case Reference Number')
  }

  // FORM HELPERS

  fillInWith = (profile: IdentityNumbersFormData): undefined => {
    if (profile.nomisId) {
      this.checkboxes.set('National Offender Management Information System (NOMIS)')
      this.nomisIdField.set(profile.nomisId)
    }

    if (profile.pncId) {
      this.checkboxes.set('Police National Computer (PNC)')
      this.pncIdField.set(profile.pncId)
    }

    if (profile.deliusId) {
      this.checkboxes.set('NDelius ID')
      this.deliusIdField.set(profile.deliusId)
    }

    if (profile.prisonNumber) {
      this.checkboxes.set('Prison Number')
      this.prisonNumberField.set(profile.prisonNumber)
    }

    if (profile.complianceAndEnforcementPersonReference) {
      this.checkboxes.set('Compliance and Enforcement Person Reference (CEPR)')
      this.complianceField.set(profile.complianceAndEnforcementPersonReference)
    }

    if (profile.courtCaseReferenceNumber) {
      this.checkboxes.set('Court Case Reference Number (CCRN)')
      this.courtCaseField.set(profile.courtCaseReferenceNumber)
    }
  }

  shouldBeValid(): void {
    this.nomisIdField.shouldNotHaveValidationMessage()
    this.pncIdField.shouldNotHaveValidationMessage()
    this.deliusIdField.shouldNotHaveValidationMessage()
    this.prisonNumberField.shouldNotHaveValidationMessage()
    this.complianceField.shouldNotHaveValidationMessage()
    this.courtCaseField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.checkboxes.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.checkboxes.shouldNotBeDisabled()
  }
}
