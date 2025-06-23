import FormCheckboxesComponent from '../../formCheckboxesComponent'
import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'
import FormTextareaComponent from '../../formTextareaComponent'

export type InstallationAndRiskFormData = {
  offence?: string
  possibleRisk?: string
  riskCategory?: string
  riskDetails?: string
  mappaLevel?: string
  mappaCaseType?: string
}

export default class InstallationAndRiskFormComponent extends FormComponent {
  // FIELDS

  get offenceField(): FormSelectComponent {
    const label = 'What type of offence did the device wearer commit?'
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

  get offenceAdditionalDetailsField(): FormTextareaComponent {
    const label = 'Any other information to be aware of about the offence committed?'
    return new FormTextareaComponent(this.form, label)
  }

  get possibleRiskField(): FormCheckboxesComponent {
    const label = "At installation what are the possible risks from the device wearer's behaviour?"
    return new FormCheckboxesComponent(this.form, label, [
      'Violent behaviour or threats of violence',
      'Sex offender',
      'Offensive towards someone because of their sex or gender',
      'Offensive towards someone because of their race, nationality, ethnicity or national origin',
      'There are no risks that the installer should be aware of',
    ])
  }

  get riskCategoryField(): FormCheckboxesComponent {
    const label = 'At installation what are the possible risks at the insallation address? (optional)'
    return new FormCheckboxesComponent(this.form, label, [
      'Offensive towards someone because of their sexual orientation',
      'History of substance abuse',
      'Diversity concerns (mental health issues, learning difficulties etc)',
      'Managed through IOM',
      'Another person or people living at the property who are threatening or violent',
      'Children under the age of 18 are living at the property',
      'Animals at the property, for example dogs',
      'Other known risks',
    ])
  }

  get riskDetailsField(): FormTextareaComponent {
    const label = 'Any other risks to be aware of?'
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

    if (profile.possibleRisk) {
      this.possibleRiskField.set(profile.possibleRisk)
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

  shouldHaveAllOptions(): void {
    this.offenceField.shouldHaveAllOptions()
    this.riskCategoryField.shouldHaveAllOptions()
    this.mappaLevelField.shouldHaveAllOptions()
    this.mappaCaseTypeField.shouldHaveAllOptions()
  }
}
