import { PageElement } from '../../../page'
import FormComponent from '../../formComponent'

export type AboutDeviceWearerDateOfBirthFormData = {
  date: string
  month: string
  year: string
}

export type AboutDeviceWearerFormData = {
  nomisId: string
  pncId: string
  deliusId: string
  prisonNumber: string
  firstNames: string
  lastName: string
  alias: string
  dob: AboutDeviceWearerDateOfBirthFormData
  is18: boolean
  sex: string
  genderIdentity: string
}

export default class AboutDeviceWearerFormComponent extends FormComponent {
  // FIELDS

  nomisIdField = (): PageElement => this.form.getByLabel('NOMIS ID')

  pncIdField = (): PageElement => this.form.getByLabel('PNC ID')

  deliusIdField = (): PageElement => this.form.getByLabel('DELIUS ID')

  prisonNumberField = (): PageElement => this.form.getByLabel('Prison Number')

  // NAMES

  firstNamesField = (): PageElement => this.form.getByLabel('First name')

  lastNameField = (): PageElement => this.form.getByLabel('Last name')

  aliasField = (): PageElement => this.form.getByLabel('Alias (optional)')

  // DATE OF BIRTH

  dateOfBirthDateField = (): PageElement => this.form.getByLabel('Day')

  dateOfBirthMonthField = (): PageElement => this.form.getByLabel('Month')

  dateOfBirthYearField = (): PageElement => this.form.getByLabel('Year')

  // IS 18

  is18Fieldset = (): PageElement =>
    this.form.getByLegend('Will the device wearer be 18 years old when the device is installed?')

  is18Field = (is18: boolean): PageElement => this.is18Fieldset().getByLabel(is18 ? 'Yes' : 'No')

  is18YesField = (): PageElement => this.is18Fieldset().getByLabel('Yes')

  is18NoField = (): PageElement => this.is18Fieldset().getByLabel('No')

  // SEX

  sexFieldset = (): PageElement => this.form.getByLegend('Sex')

  sexField = (sex: string): PageElement => this.sexFieldset().getByLabel(sex)

  sexMaleField = (): PageElement => this.sexFieldset().getByLabel('Male')

  sexFemaleField = (): PageElement => this.sexFieldset().getByLabel('Female')

  sexPreferNotToSayField = (): PageElement => this.sexFieldset().getByLabel('Prefer not to say')

  sexDoNotKnowField = (): PageElement => this.sexFieldset().getByLabel("Don't know")

  // GENDER IDENTITY

  genderIdentityFieldset = (): PageElement => this.form.getByLegend('Gender identity')

  genderIdentityField = (genderIdentity: string): PageElement =>
    this.genderIdentityFieldset().getByLabel(genderIdentity)

  genderIdentityMaleField = (): PageElement => this.genderIdentityFieldset().getByLabel('Male')

  genderIdentityFemaleField = (): PageElement => this.genderIdentityFieldset().getByLabel('Female')

  genderIdentityNonBinaryField = (): PageElement => this.genderIdentityFieldset().getByLabel('Non-binary')

  genderIdentityDoNotKnowField = (): PageElement => this.genderIdentityFieldset().getByLabel("Don't know")

  genderIdentitySelfIdentifyField = (): PageElement => this.genderIdentityFieldset().getByLabel('Self identify')

  // FORM HELPERS

  fillInWith = (profile: AboutDeviceWearerFormData): undefined => {
    this.nomisIdField().type(profile.nomisId)
    this.pncIdField().type(profile.pncId)
    this.deliusIdField().type(profile.deliusId)
    this.prisonNumberField().type(profile.prisonNumber)

    this.firstNamesField().type(profile.firstNames)
    this.lastNameField().type(profile.lastName)

    this.aliasField().type(profile.alias)

    this.dateOfBirthDateField().type(profile.dob.date)
    this.dateOfBirthMonthField().type(profile.dob.month)
    this.dateOfBirthYearField().type(profile.dob.year)

    this.is18Field(profile.is18).click()
    this.sexField(profile.sex).click()
    this.genderIdentityField(profile.genderIdentity).click()
  }
}
