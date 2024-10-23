import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type AboutDeviceWearerFormData = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string
  firstNames?: string
  lastName?: string
  alias?: string
  dob?: Date
  is18?: boolean
  sex?: string
  genderIdentity?: string
}

export default class AboutDeviceWearerFormComponent extends FormComponent {
  // FIELDS

  get nomisIdField(): FormInputComponent {
    const label = 'NOMIS ID'
    return new FormInputComponent(this.form, label)
  }

  get pncIdField(): FormInputComponent {
    const label = 'PNC ID'
    return new FormInputComponent(this.form, label)
  }

  get deliusIdField(): FormInputComponent {
    const label = 'DELIUS ID'
    return new FormInputComponent(this.form, label)
  }

  get prisonNumberField(): FormInputComponent {
    const label = 'Prison Number'
    return new FormInputComponent(this.form, label)
  }

  // NAMES

  get firstNamesField(): FormInputComponent {
    const label = 'First name'
    return new FormInputComponent(this.form, label)
  }

  get lastNameField(): FormInputComponent {
    const label = 'Last name'
    return new FormInputComponent(this.form, label)
  }

  get aliasField(): FormInputComponent {
    const label = 'Alias (optional)'
    return new FormInputComponent(this.form, label)
  }

  // DATE OF BIRTH

  get dateOfBirthField(): FormDateComponent {
    const label = 'Date of birth'
    return new FormDateComponent(this.form, label)
  }

  // IS 18

  get is18Field(): FormRadiosComponent {
    const label = 'Will the device wearer be 18 years old when the device is installed?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // SEX

  get sexField(): FormRadiosComponent {
    const label = 'Sex'
    return new FormRadiosComponent(this.form, label, ['Male', 'Female', 'Prefer not to say', "Don't know"])
  }

  // GENDER IDENTITY

  get genderIdentityField(): FormRadiosComponent {
    const label = 'Gender identity'
    return new FormRadiosComponent(this.form, label, ['Male', 'Female', 'Non-binary', "Don't know", 'Self identify'])
  }

  // FORM HELPERS

  fillInWith = (profile: AboutDeviceWearerFormData): undefined => {
    this.nomisIdField.set(profile.nomisId)
    this.pncIdField.set(profile.pncId)
    this.deliusIdField.set(profile.deliusId)
    this.prisonNumberField.set(profile.prisonNumber)

    this.firstNamesField.set(profile.firstNames)
    this.lastNameField.set(profile.lastName)

    this.aliasField.set(profile.alias)

    this.dateOfBirthField.set(profile.dob)

    this.is18Field.set(profile.is18 ? 'Yes' : 'No')
    this.sexField.set(profile.sex)
    this.genderIdentityField.set(profile.genderIdentity)
  }
}
