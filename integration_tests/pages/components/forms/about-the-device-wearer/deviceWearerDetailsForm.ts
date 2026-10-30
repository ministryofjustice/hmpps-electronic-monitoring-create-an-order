import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type DeviceWearerDetailsFormData = {
  firstName?: string
  middleName?: string
  lastName?: string
  alias?: string
  dob?: Date
  sex?: string
  genderIdentity?: string
}

const getByLegend = true

export default class DeviceWearerDetailsFormComponent extends FormComponent {
  get firstNameField(): FormInputComponent {
    return new FormInputComponent(this.form, "What is the device wearer's first name?")
  }

  get middleNameField(): FormInputComponent {
    return new FormInputComponent(this.form, "What is the device wearer's middle name? (optional)")
  }

  get lastNameField(): FormInputComponent {
    return new FormInputComponent(this.form, "What is the device wearer's last name?")
  }

  get aliasField(): FormInputComponent {
    return new FormInputComponent(this.form, "What is the device wearer's preferred name or names? (optional)")
  }

  get dateOfBirthField(): FormDateComponent {
    return new FormDateComponent(this.form, "What is the device wearer's date of birth?")
  }

  get sexField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'What is the sex of the device wearer?',
      ['Male', 'Female', 'Not able to provide this information'],
      getByLegend,
    )
  }

  get genderIdentityField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      "What is the device wearer's gender?",
      ['Male', 'Female', 'Non binary', 'Self identify', 'Not able to provide this information'],
      getByLegend,
    )
  }

  fillInWith = (profile: DeviceWearerDetailsFormData): undefined => {
    if (profile.firstName) {
      this.firstNameField.set(profile.firstName)
    }

    if (profile.middleName) {
      this.middleNameField.set(profile.middleName)
    }

    if (profile.lastName) {
      this.lastNameField.set(profile.lastName)
    }

    if (profile.alias) {
      this.aliasField.set(profile.alias)
    }

    if (profile.dob) {
      this.dateOfBirthField.set(profile.dob)
    }

    if (profile.sex) {
      this.sexField.set(profile.sex)
    }

    if (profile.genderIdentity) {
      this.genderIdentityField.set(profile.genderIdentity)
    }
  }

  shouldBeDisabled(): void {
    this.firstNameField.shouldBeDisabled()
    this.middleNameField.shouldBeDisabled()
    this.lastNameField.shouldBeDisabled()
    this.aliasField.shouldBeDisabled()
    this.dateOfBirthField.shouldBeDisabled()
    this.sexField.shouldBeDisabled()
    this.genderIdentityField.shouldBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.sexField.shouldHaveAllOptions()
    this.genderIdentityField.shouldHaveAllOptions()
  }
}
