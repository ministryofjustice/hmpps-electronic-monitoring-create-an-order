import FormAddressComponent, { FormAddressData } from '../../formAddressComponent'
import FormAutocompleteComponent from '../../formAutocompleteComponent'
import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'

export type InterestedPartiesFormData = {
  notifyingOrganisation?: string
  prison?: string
  crownCourt?: string
  magistratesCourt?: string
  notifyingOrganisationEmailAddress?: string

  responsibleOrganisation?: string
  responsibleOrganisationContactNumber?: string
  responsibleOrganisationEmailAddress?: string
  probationRegion?: string
  yjsRegion?: string
  responsibleOrganisationAddress?: FormAddressData

  responsibleOfficerName?: string
  responsibleOfficerContactNumber?: string
}

export default class InterestedPartiesFormComponent extends FormComponent {
  // FIELDS

  get notifyingOrganisationField(): FormRadiosComponent {
    const label = 'What organisation or related organisation are you part of?'
    return new FormRadiosComponent(this.form, label, [
      'Crown Court',
      'Magistrates Court',
      'Prison',
      'Home Office',
      'Scottish Court',
      'Family Court',
      'Probation',
    ])
  }

  get prisonField(): FormAutocompleteComponent {
    const label = 'Select the name of the Prison'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get crownCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Crown Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get magistratesCourtField(): FormAutocompleteComponent {
    const label = 'Select the name of the Court'
    return new FormAutocompleteComponent(this.form, label, [])
  }

  get notifyOrganisationEmailAddressField(): FormInputComponent {
    const label = 'What is the email address for your team?'
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

  get responsibleOrganisationField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'What organisation is the responsible officer part of?', [
      'Youth Justice Service (YJS)',
      'Youth Custody Service (YCS)',
      'Probation',
      'Field monitoring service',
      'Home Office',
      'Police',
    ])
  }

  get probationRegionField(): FormSelectComponent {
    const label = 'Select the Probation region'
    return new FormSelectComponent(this.form, label, [
      'North East',
      'North West',
      'Yorkshire and the Humber',
      'Greater Manchester',
      'East Midlands',
      'Wales',
      'West Midlands',
      'East of England',
      'South West',
      'South Central',
      'London',
      'Kent, Surrey & Sussex',
    ])
  }

  get yjsRegionField(): FormSelectComponent {
    const label = 'Select the Youth Justice Service region'
    return new FormSelectComponent(this.form, label, [
      'North East and Cumbria',
      'North West',
      'Yorkshire and Humberside',
      'Midlands',
      'Wales',
      'South West and Central',
      'London',
      'East and South East',
    ])
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

  fillInWith(profile: InterestedPartiesFormData): void {
    if (profile.notifyingOrganisation) {
      this.notifyingOrganisationField.set(profile.notifyingOrganisation)
    }

    if (profile.prison) {
      this.prisonField.set(profile.prison)
    }

    if (profile.crownCourt) {
      this.crownCourtField.set(profile.crownCourt)
    }

    if (profile.magistratesCourt) {
      this.magistratesCourtField.set(profile.magistratesCourt)
    }

    if (profile.notifyingOrganisationEmailAddress) {
      this.notifyOrganisationEmailAddressField.set(profile.notifyingOrganisationEmailAddress)
    }

    if (profile.responsibleOrganisation) {
      this.responsibleOrganisationField.set(profile.responsibleOrganisation)
    }

    if (profile.probationRegion) {
      this.probationRegionField.set(profile.probationRegion)
    }

    if (profile.yjsRegion) {
      this.yjsRegionField.set(profile.yjsRegion)
    }

    if (profile.responsibleOrganisationContactNumber) {
      this.responsibleOrganisationContactNumberField.set(profile.responsibleOrganisationContactNumber)
    }

    if (profile.responsibleOrganisationEmailAddress) {
      this.responsibleOrganisationEmailAddressField.set(profile.responsibleOrganisationEmailAddress)
    }

    if (profile.responsibleOrganisationAddress) {
      this.responsibleOrganisationAddressField.set(profile.responsibleOrganisationAddress)
    }

    if (profile.responsibleOfficerName) {
      this.responsibleOfficerNameField.set(profile.responsibleOfficerName)
    }

    if (profile.responsibleOfficerContactNumber) {
      this.responsibleOfficerContactNumberField.set(profile.responsibleOfficerContactNumber)
    }
  }

  shouldBeValid(): void {
    this.notifyingOrganisationField.shouldNotHaveValidationMessage()
    this.prisonField.shouldNotHaveValidationMessage()
    this.notifyOrganisationEmailAddressField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationField.shouldNotHaveValidationMessage()
    this.probationRegionField.shouldNotHaveValidationMessage()
    this.yjsRegionField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationContactNumberField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationEmailAddressField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationAddressField.shouldNotHaveValidationMessage()
    this.responsibleOfficerNameField.shouldNotHaveValidationMessage()
    this.responsibleOfficerContactNumberField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.notifyingOrganisationField.shouldBeDisabled()
    this.notifyOrganisationEmailAddressField.shouldBeDisabled()
    this.responsibleOrganisationField.shouldBeDisabled()
    this.probationRegionField.shouldBeDisabled()
    this.yjsRegionField.shouldBeDisabled()
    this.responsibleOrganisationContactNumberField.shouldBeDisabled()
    this.responsibleOrganisationEmailAddressField.shouldBeDisabled()
    this.responsibleOrganisationAddressField.shouldBeDisabled()
    this.responsibleOfficerNameField.shouldBeDisabled()
    this.responsibleOfficerContactNumberField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.notifyingOrganisationField.shouldNotBeDisabled()
    this.notifyOrganisationEmailAddressField.shouldNotBeDisabled()
    this.responsibleOrganisationField.shouldNotBeDisabled()
    this.probationRegionField.shouldNotBeDisabled()
    this.yjsRegionField.shouldNotBeDisabled()
    this.responsibleOrganisationContactNumberField.shouldNotBeDisabled()
    this.responsibleOrganisationEmailAddressField.shouldNotBeDisabled()
    this.responsibleOrganisationAddressField.shouldNotBeDisabled()
    this.responsibleOfficerNameField.shouldNotBeDisabled()
    this.responsibleOfficerContactNumberField.shouldNotBeDisabled()
  }
}
