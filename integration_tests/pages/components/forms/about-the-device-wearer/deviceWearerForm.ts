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

  // Interpreter

  get interpreterRequiredField(): FormRadiosComponent {
    const label = 'Language'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get languageField(): FormSelectComponent {
    return new FormSelectComponent(this.form, "What is the device wearer's main language", [
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

    this.interpreterRequiredField.set(profile.interpreterRequired ? 'Yes' : 'No')

    if (profile.language) {
      this.languageField.set(profile.language)
    }
  }
}
