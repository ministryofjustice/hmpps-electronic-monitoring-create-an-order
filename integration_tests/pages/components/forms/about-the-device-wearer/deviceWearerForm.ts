import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'

export type AboutDeviceWearerFormData = {
  firstNames?: string
  lastName?: string
  alias?: string
  dob?: Date
  is18?: boolean
  sex?: string
  genderIdentity?: string
  interpreterRequired?: boolean
  language?: string
  disabilities?: string
  otherDisability?: string
}

export default class AboutDeviceWearerFormComponent extends FormComponent {
  // FIELDS

  // NAMES

  get firstNamesField(): FormInputComponent {
    const label = "What is the device wearer's first name?"
    return new FormInputComponent(this.form, label)
  }

  get lastNameField(): FormInputComponent {
    const label = "What is the device wearer's last name?"
    return new FormInputComponent(this.form, label)
  }

  get aliasField(): FormInputComponent {
    const label = "What is the device wearer's preferred name or names? (optional)"
    return new FormInputComponent(this.form, label)
  }

  // DATE OF BIRTH

  get dateOfBirthField(): FormDateComponent {
    const label = "What is the device wearer's date of birth?"
    return new FormDateComponent(this.form, label)
  }

  // IS 18

  get responsibleAdultRequiredField(): FormRadiosComponent {
    const label = 'Is a responsible adult required?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  // SEX

  get sexField(): FormRadiosComponent {
    const label = 'What is the sex of the device wearer?'
    return new FormRadiosComponent(this.form, label, [
      'Male',
      'Female',
      'Prefer not to say',
      'Not able to provide this information',
    ])
  }

  // GENDER IDENTITY

  get genderIdentityField(): FormRadiosComponent {
    const label = "What is the device wearer's gender?"
    return new FormRadiosComponent(this.form, label, [
      'Male',
      'Female',
      'Non binary',
      'Not able to provide this information',
      'Self identify',
    ])
  }

  // Disabilities

  get disabilityField(): FormRadiosComponent {
    const label = 'Does the device wearer have any of the disabilities or health conditions listed? (optional)'
    return new FormRadiosComponent(this.form, label, [
      'Visual impairment or blindness not corrected by wearing glasses',
      'Deafness or serious hearing impairment',
      'Physical disability or mobility issue',
      'Fine motor or dexterity impairment',
      'Neurodiversity including conditions affecting learning, understanding or concentration',
      'Condition affecting the memory or retaining information',
      'Mental health condition',
      'Health condition affecting stamina, breathing or causing fatigue',
      'Conditions affecting social skills and behaviour',
      'The device wearer has a disability or health condition not listed',
      'Not able to provide this information',
    ])
  }

  get otherDisabilityField(): FormInputComponent {
    const label = "What is the device wearer's disability or health condition?"
    return new FormInputComponent(this.form, label)
  }

  // Interpreter

  get interpreterRequiredField(): FormRadiosComponent {
    const label = 'Is an interpreter needed?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get languageField(): FormSelectComponent {
    return new FormSelectComponent(this.form, 'What language does the interpreter need to use? (optional)', [
      'British Sign',
      'Lipspeak (English)',
      'Palantypists',
      'Sign Supported English',
      'Albanian',
      'Algerian',
      'Amharic',
      'Arabic',
      'Armenian (Eastern)',
      'Azerbaijani',
      'Azeri',
      'Bambara',
      'Belarusian',
      'Bengali',
      'Bilen',
      'Bosnian',
      'Bravanese',
      'Bulgarian',
      'Cantonese',
      'Croatian',
      'Czech',
      'Dari',
      'Dioula',
      'Dutch',
      'Farsi',
      'Flemish (Dutch)',
      'French',
      'Fula',
      'Georgian',
      'German',
      'Greek',
      'Gujarati',
      'Hebrew',
      'Hindi',
      'Hindko',
      'Hungarian',
      'Igbo',
      'Ilocano',
      'Indonesian',
      'Italian',
      'Jamaican Patois',
      'Japanese',
      'Kibajuni',
      'Kikuyu',
      'Kinyarwanda',
      'Kirundi',
      'Korean',
      'Krio',
      'Kurdish:Bahdini',
      'Kurdish:Feyli',
      'Kurdish:Kurmanji',
      'Kurdish:Sorani',
      'Lao',
      'Latvian',
      'Lingala',
      'Lithuanian',
      'Luganda',
      'Macedonian (Gorani)',
      'Malayalam',
      'Mandarin',
      'Mandinka',
      'Maninka',
      'Mauritian Creole',
      'Mende',
      'Mirpuri',
      'Moldovan',
      'Mongolian',
      'Moroccan',
      'Nepalese',
      'Norwegian',
      'Oromo',
      'Pahari',
      'Pangasinan',
      'Panjabi (Indian)',
      'Panjabi (Pakistani)',
      'Pashto',
      'Pidgin English (Nigerian)',
      'Pidgin English (West African)',
      'Polish',
      'Portuguese',
      'Pothwari',
      'Romani',
      'Romanian',
      'Russian',
      'Serbian',
      'Shona',
      'Sinhalese',
      'Slovak',
      'Somali',
      'Spanish',
      'Sudanese Arabic',
      'Susu',
      'Swahili',
      'Swedish',
      'Sylheti',
      'Tagalog',
      'Tamil',
      'Telugu',
      'Temne',
      'Thai',
      'Tigrinya',
      'Turkish',
      'Twi',
      'Ukrainian',
      'Urdu',
      'Vietnamese',
      'Wolof',
      'Yoruba',
      'Zaghawa',
    ])
  }

  // FORM HELPERS

  fillInWith = (profile: AboutDeviceWearerFormData): undefined => {
    if (profile.firstNames) {
      this.firstNamesField.set(profile.firstNames)
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

    if (profile.is18 !== undefined) {
      this.responsibleAdultRequiredField.set(profile.is18 ? 'No' : 'Yes')
    }

    if (profile.sex) {
      this.sexField.set(profile.sex)
    }

    if (profile.genderIdentity) {
      this.genderIdentityField.set(profile.genderIdentity)
    }

    if (profile.interpreterRequired !== undefined) {
      this.interpreterRequiredField.set(profile.interpreterRequired ? 'Yes' : 'No')
    }

    if (profile.language) {
      this.languageField.set(profile.language)
    }

    if (profile.disabilities) {
      this.disabilityField.set(profile.disabilities)
    }

    if (profile.otherDisability) {
      this.otherDisabilityField.set(profile.otherDisability)
    }
  }

  shouldBeValid(): void {
    this.firstNamesField.shouldNotHaveValidationMessage()
    this.lastNameField.shouldNotHaveValidationMessage()
    this.aliasField.shouldNotHaveValidationMessage()
    this.dateOfBirthField.shouldNotHaveValidationMessage()
    this.responsibleAdultRequiredField.shouldNotHaveValidationMessage()
    this.sexField.shouldNotHaveValidationMessage()
    this.genderIdentityField.shouldNotHaveValidationMessage()
    this.interpreterRequiredField.shouldNotHaveValidationMessage()
    this.languageField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.firstNamesField.shouldBeDisabled()
    this.lastNameField.shouldBeDisabled()
    this.aliasField.shouldBeDisabled()
    this.dateOfBirthField.shouldBeDisabled()
    this.responsibleAdultRequiredField.shouldBeDisabled()
    this.sexField.shouldBeDisabled()
    this.genderIdentityField.shouldBeDisabled()
    this.interpreterRequiredField.shouldBeDisabled()
    this.languageField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.firstNamesField.shouldNotBeDisabled()
    this.lastNameField.shouldNotBeDisabled()
    this.aliasField.shouldNotBeDisabled()
    this.dateOfBirthField.shouldNotBeDisabled()
    this.responsibleAdultRequiredField.shouldNotBeDisabled()
    this.sexField.shouldNotBeDisabled()
    this.genderIdentityField.shouldNotBeDisabled()
    this.interpreterRequiredField.shouldNotBeDisabled()
    this.languageField.shouldNotBeDisabled()
  }
}
