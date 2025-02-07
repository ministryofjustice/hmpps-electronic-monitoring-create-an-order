import FormCheckboxesComponent from '../../formCheckboxesComponent'
import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'
import FormTextareaComponent from '../../formTextareaComponent'

export type InstallationAndRiskFormData = {
  offence?: string
  riskCategory?: string
  riskDetails?: string
  mappaLevel?: string
  mappaCaseType?: string
}

export default class InstallationAndRiskFormComponent extends FormComponent {
  // FIELDS

  get offenceField(): FormSelectComponent {
    const label = 'Select the offence committed by the device wearer(optional)'
    return new FormSelectComponent(this.form, label, [
      'Violence against the person',
      'Sexual offences',
      'Robbery',
      'Theft Offences',
      'Criminal damage and arson',
      'Drug offences',
      'Possession of weapons',
      'Public order offences',
      'Miscellaneous crimes against society',
      'Fraud Offences',
      'Summary Non-Motoring',
      'Summary motoring',
      'Offence not recorded',
    ])
  }

  get riskCategoryField(): FormCheckboxesComponent {
    const label = 'Select the risks that apply to the device wearer'
    return new FormCheckboxesComponent(this.form, label, [
      'Threats of Violence',
      'Sexual Offences',
      'Risk to Specific Gender',
      'Racial Abuse or Threats',
      'History of Substance Abuse',
      'Diversity Concerns (mental health issues, learning difficulties etc.)',
      'Dangerous Dogs/Pets at Premises',
      'Is the Subject managed through IOM?',
      'Safeguarding Issues',
      'Other occupants who pose a risk to staff',
      'Other known Risks',
      'Is there evidence known to the subject having homophobic views?',
      'Offence Risk',
      'Postcode Risk',
      'Under 18 living at property',
    ])
  }

  get riskDetailsField(): FormTextareaComponent {
    const label = 'Provide details that will help lower risk of violence or threatening behaviour at installation.'
    return new FormTextareaComponent(this.form, label)
  }

  get mappaLevelField(): FormRadiosComponent {
    const label = 'Which level of MAPPA applies? (optional)'
    return new FormRadiosComponent(this.form, label, ['MAPPA 1', 'MAPPA 2', 'MAPPA 3'])
  }

  get mappaCaseTypeField(): FormRadiosComponent {
    const label = 'What is the MAPPA case type? (optional)'
    return new FormRadiosComponent(this.form, label, [
      'Serious Organised Crime',
      'Terrorism Act, Counter Terrorism',
      'Terrorism Prevention and Investigation measures',
      'Special Immigration Appeals Commission',
      'High Profile Immigration',
      'Critical Public Protection Case',
    ])
  }

  // FORM HELPERS

  fillInWith(profile: InstallationAndRiskFormData = {}): void {
    if (profile.offence) {
      this.offenceField.set(profile.offence)
    }

    if (profile.riskCategory) {
      this.riskCategoryField.set(profile.riskCategory)
    }

    if (profile.riskDetails) {
      this.riskDetailsField.set(profile.riskDetails)
    }

    if (profile.mappaLevel) {
      this.mappaLevelField.set(profile.mappaLevel)
    }

    if (profile.mappaCaseType) {
      this.mappaCaseTypeField.set(profile.mappaCaseType)
    }
  }

  shouldBeValid(): void {
    this.offenceField.shouldNotHaveValidationMessage()
    this.riskCategoryField.shouldNotHaveValidationMessage()
    this.riskDetailsField.shouldNotHaveValidationMessage()
    this.mappaLevelField.shouldNotHaveValidationMessage()
    this.mappaCaseTypeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.offenceField.shouldBeDisabled()
    this.riskCategoryField.shouldBeDisabled()
    this.riskDetailsField.shouldBeDisabled()
    this.mappaLevelField.shouldBeDisabled()
    this.mappaCaseTypeField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.offenceField.shouldNotBeDisabled()
    this.riskCategoryField.shouldNotBeDisabled()
    this.riskDetailsField.shouldNotBeDisabled()
    this.mappaLevelField.shouldNotBeDisabled()
    this.mappaCaseTypeField.shouldNotBeDisabled()
  }
}
