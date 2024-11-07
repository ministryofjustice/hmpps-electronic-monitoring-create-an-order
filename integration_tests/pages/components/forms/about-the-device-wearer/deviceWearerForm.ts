import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormSelectComponent from '../../formSelectComponent'

export type AboutDeviceWearerFormData = {
  nomisId?: string
  pncId?: string
  deliusId?: string
  prisonNumber?: string
  homeOfficeReferenceNumber?: string
  firstNames?: string
  lastName?: string
  alias?: string
  dob?: Date
  is18?: boolean
  sex?: string
  genderIdentity?: string
  interpreterRequired?: boolean
  language?: string
}

export default class AboutDeviceWearerFormComponent extends FormComponent {
  // FIELDS

  get nomisIdField(): FormInputComponent {
    const label = 'National Offender Management Information System (NOMIS) ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get pncIdField(): FormInputComponent {
    const label = 'Police National Computer (PNC) ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get deliusIdField(): FormInputComponent {
    const label = 'Delius ID (optional)'
    return new FormInputComponent(this.form, label)
  }

  get prisonNumberField(): FormInputComponent {
    const label = 'Prison Number (Optional)'
    return new FormInputComponent(this.form, label)
  }

  get homeOfficeReferenceNumberField(): FormInputComponent {
    const label = 'Home Office Reference Number (Optional)'
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
    const label = 'Preferred name or alias (optional)'
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
    return new FormRadiosComponent(this.form, label, ['Male', 'Female', 'Non binary', "Don't know", 'Self identify'])
  }

  get otherGenderField(): FormInputComponent {
    const label = 'Other gender'
    return new FormInputComponent(this.form, label)
  }

  // Disabilities

  get disabilityField(): FormRadiosComponent {
    const label = 'Disability (optional)'
    return new FormRadiosComponent(this.form, label, [
      'Vision',
      'Hearing',
      'Mobility',
      'Dexterity',
      'Learning, understanding or concentrating',
      'Memory',
      'Mental health',
      'Stamina or breathing or fatigue',
      'Other',
      'None of the above',
      'Prefer Not to Say',
    ])
  }

  get otherDisabilityField(): FormInputComponent {
    const label = 'Other disability'
    return new FormInputComponent(this.form, label)
  }

  disabilities

  // Interpreter

  get interpreterRequiredField(): FormRadiosComponent {
    const label = 'Language'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get languageField(): FormSelectComponent {
    return new FormSelectComponent(this.form, "What is the device wearer's main language?", [
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
    if (profile.nomisId) {
      this.nomisIdField.set(profile.nomisId)
    }
    if (profile.pncId) {
      this.pncIdField.set(profile.pncId)
    }
    if (profile.deliusId) {
      this.deliusIdField.set(profile.deliusId)
    }
    if (profile.prisonNumber) {
      this.prisonNumberField.set(profile.prisonNumber)
    }
    if (profile.homeOfficeReferenceNumber) {
      this.homeOfficeReferenceNumberField.set(profile.homeOfficeReferenceNumber)
    }

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
      this.is18Field.set(profile.is18 ? 'Yes' : 'No')
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
  }
}
