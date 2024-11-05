import FormAddressComponent, { FormAddressData } from '../../formAddressComponent'
import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type InteredPartiesFormData = {
  notifyingOrganisationEmailAddress?: string

  responsibleOrganisationName?: string
  responsibleOrganisationContactNumber?: string
  responsibleOrganisationEmailAddress?: string
  responsibleOrganisationRegion?: string
  responsbibleOrganisationAddress?: FormAddressData

  responsibleOfficerName?: string
  responsibleOfficerContactNumber?: string
}

export default class InterestedPartiesFormComponent extends FormComponent {
  // FIELDS

  get notifyOrganisationEmailAddressField(): FormInputComponent {
    const label = 'Email address for the notifying organisation'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOfficerNameField(): FormInputComponent {
    const label = 'Full name of responsible officer'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOfficerContactNumberField(): FormInputComponent {
    const label = 'Telephone number for responsible officer'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationNameField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What type of organisation is the responsible officer part of?', [
      'Youth Justice Service (YJS)',
      'Youth Custody Service (YCS)',
      'Probation',
      'Field monitoring service',
      'Home Office',
      'Police',
    ])
  }

  get responsibleOrganisationRegionField(): FormInputComponent {
    const label = 'What region is the responsible organisation in?'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationAddressField(): FormAddressComponent {
    const label = 'What is the address of the responsible organisation?'
    return new FormAddressComponent(this.form, label)
  }

  get responsibleOrganisationContactNumberField(): FormInputComponent {
    const label = 'Telephone number for responsible organisation'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationEmailAddressField(): FormInputComponent {
    const label = 'Email address for responsible organisation'
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith(profile: InteredPartiesFormData): void {
    if (profile.notifyingOrganisationEmailAddress) {
      this.notifyOrganisationEmailAddressField.set(profile.notifyingOrganisationEmailAddress)
    }

    if (profile.responsibleOrganisationName) {
      this.responsibleOrganisationNameField.set(profile.responsibleOrganisationName)
    }

    if (profile.responsibleOrganisationRegion) {
      this.responsibleOrganisationRegionField.set(profile.responsibleOrganisationRegion)
    }

    if (profile.responsibleOrganisationContactNumber) {
      this.responsibleOrganisationContactNumberField.set(profile.responsibleOrganisationContactNumber)
    }

    if (profile.responsibleOrganisationEmailAddress) {
      this.responsibleOrganisationEmailAddressField.set(profile.responsibleOrganisationEmailAddress)
    }

    if (profile.responsbibleOrganisationAddress) {
      this.responsibleOrganisationAddressField.set(profile.responsbibleOrganisationAddress)
    }

    if (profile.responsibleOfficerName) {
      this.responsibleOfficerNameField.set(profile.responsibleOfficerName)
    }

    if (profile.responsibleOfficerContactNumber) {
      this.responsibleOfficerContactNumberField.set(profile.responsibleOfficerContactNumber)
    }
  }

  shouldBeValid(): void {
    this.notifyOrganisationEmailAddressField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationNameField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationRegionField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationContactNumberField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationEmailAddressField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationAddressField.shouldNotHaveValidationMessage()
    this.responsibleOfficerNameField.shouldNotHaveValidationMessage()
    this.responsibleOfficerContactNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.notifyOrganisationEmailAddressField.shouldBeDisabled()
    this.responsibleOrganisationNameField.shouldBeDisabled()
    this.responsibleOrganisationRegionField.shouldBeDisabled()
    this.responsibleOrganisationContactNumberField.shouldBeDisabled()
    this.responsibleOrganisationEmailAddressField.shouldBeDisabled()
    this.responsibleOrganisationAddressField.shouldBeDisabled()
    this.responsibleOfficerNameField.shouldBeDisabled()
    this.responsibleOfficerContactNumberField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.notifyOrganisationEmailAddressField.shouldNotBeDisabled()
    this.responsibleOrganisationNameField.shouldNotBeDisabled()
    this.responsibleOrganisationRegionField.shouldNotBeDisabled()
    this.responsibleOrganisationContactNumberField.shouldNotBeDisabled()
    this.responsibleOrganisationEmailAddressField.shouldNotBeDisabled()
    this.responsibleOrganisationAddressField.shouldNotBeDisabled()
    this.responsibleOfficerNameField.shouldNotBeDisabled()
    this.responsibleOfficerContactNumberField.shouldNotBeDisabled()
  }
}
