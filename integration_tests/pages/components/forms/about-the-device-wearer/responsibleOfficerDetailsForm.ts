import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type ResponsibleOfficeOrganisation = {
  name?: string
  region?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    county?: string
    postcode?: string
  }
  contactNumber?: string
}

export type ResponsibleOfficerDetailsFormData = {
  fullName?: string
  contactNumber?: string
  organisation?: ResponsibleOfficeOrganisation
  emailAddress?: string
}

export default class ResponsibleOfficerDetailsFormComponent extends FormComponent {
  // FIELDS

  get responsibleOfficerNameField(): FormInputComponent {
    const label = 'Responsible officer name'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOfficerContactNumberField(): FormInputComponent {
    const label = 'Responsible officer contact number'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationNameField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Gender identity', [
      'YJS',
      'YCS',
      'Probation',
      'Field monitoring service',
      'Home Office',
      'Police',
    ])
  }

  // TODO: we need a FormSelectComponent

  get responsibleOrganisationRegionField(): FormInputComponent {
    const label = 'Responsible organisation details - region'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationAddressField(): FormInputComponent {
    const label = 'Responsible organisation address'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationContactNumberField(): FormInputComponent {
    const label = 'Responsible organisation contact number'
    return new FormInputComponent(this.form, label)
  }

  get responsibleOrganisationEmailAddressField(): FormInputComponent {
    const label = 'Responsible organisation email address'
    return new FormInputComponent(this.form, label)
  }

  // FORM HELPERS

  fillInWith(data: ResponsibleOfficerDetailsFormData): void {
    if (data.fullName) {
      this.responsibleOfficerNameField.set(data.fullName)
    }

    if (data.contactNumber) {
      this.responsibleOfficerContactNumberField.set(data.contactNumber)
    }

    if (data.emailAddress) {
      this.responsibleOrganisationEmailAddressField.set(data.emailAddress)
    }

    if (!data.organisation) {
      return
    }

    if (data.organisation.name) {
      this.responsibleOrganisationNameField.set(data.organisation.name)
    }

    if (data.organisation.region) {
      // this.responsibleOrganisationRegionField.set(data.organisation.region)
    }

    if (data.organisation.contactNumber) {
      this.responsibleOrganisationContactNumberField.set(data.organisation.contactNumber)
    }

    if (!data.organisation.address) {
      return
    }

    if (data.organisation.address.postcode) {
      this.responsibleOrganisationAddressField.set(data.organisation.address.postcode)
    }
  }

  shouldBeValid(): void {
    this.responsibleOfficerNameField.shouldNotHaveValidationMessage()
    this.responsibleOfficerContactNumberField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationNameField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationRegionField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationAddressField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationContactNumberField.shouldNotHaveValidationMessage()
    this.responsibleOrganisationEmailAddressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.responsibleOfficerNameField.shouldBeDisabled()
    this.responsibleOfficerContactNumberField.shouldBeDisabled()
    this.responsibleOrganisationNameField.shouldBeDisabled()
    this.responsibleOrganisationRegionField.shouldBeDisabled()
    this.responsibleOrganisationAddressField.shouldBeDisabled()
    this.responsibleOrganisationContactNumberField.shouldBeDisabled()
    this.responsibleOrganisationEmailAddressField.shouldBeDisabled()
  }
}
