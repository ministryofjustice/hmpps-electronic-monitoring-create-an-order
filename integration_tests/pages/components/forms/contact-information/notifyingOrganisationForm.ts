import FormAddressComponent from '../../formAddressComponent'
import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type ResponsibleOfficerDetailsFormData = {
  fullName?: string
  contactNumber?: string
  emailAddress?: string
}

export type NotifyingOrganisationFormData = {
  emailAddress?: string

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

  responsibleOfficer?: ResponsibleOfficerDetailsFormData
}

export default class NotifyingOrganisationFormComponent extends FormComponent {
  // FIELDS

  get emailAddressField(): FormInputComponent {
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

  fillInWith(data: NotifyingOrganisationFormData): void {
    if (data.emailAddress) {
      this.emailAddressField.set(data.emailAddress)
    }

    this.fillInResponsibleOrganisationDetailsWith(data)

    const { responsibleOfficer } = data
    if (responsibleOfficer) {
      this.fillInResponsibleOfficerDetailsWith(responsibleOfficer)
    }

    const { address } = data
    if (address) {
      this.responsibleOrganisationAddressField.set(address)
    }
  }

  fillInResponsibleOrganisationDetailsWith(data: NotifyingOrganisationFormData): void {
    if (data.name) {
      this.responsibleOrganisationNameField.set(data.name)
    }

    if (data.region) {
      this.responsibleOrganisationRegionField.set(data.region)
    }

    if (data.contactNumber) {
      this.responsibleOrganisationContactNumberField.set(data.contactNumber)
    }
  }

  fillInResponsibleOfficerDetailsWith(data: ResponsibleOfficerDetailsFormData): void {
    if (data.fullName) {
      this.responsibleOfficerNameField.set(data.fullName)
    }

    if (data.contactNumber) {
      this.responsibleOfficerContactNumberField.set(data.contactNumber)
    }

    if (data.emailAddress) {
      this.responsibleOrganisationEmailAddressField.set(data.emailAddress)
    }
  }

  shouldBeValid(): void {
    this.emailAddressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.emailAddressField.shouldBeDisabled()
  }
}
