import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormAutocompleteComponent from '../../formAutocompleteComponent'

export type LanguageFormData = {
  interpreterRequired?: 'Yes' | 'No' | 'Not able to provide this information'
  language?: string
}

export default class LanguageFormComponent extends FormComponent {
  get interpreterRequiredField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Is an interpreter needed?',
      ['Yes', 'No', 'Not able to provide this information'],
      true,
    )
  }

  get languageField(): FormAutocompleteComponent {
    return new FormAutocompleteComponent(this.form, 'What language does the interpreter need to use?', [
      'British Sign',
      'Arabic',
      'French',
    ])
  }

  fillInWith = ({ interpreterRequired, language }: LanguageFormData): void => {
    if (interpreterRequired) {
      this.interpreterRequiredField.set(interpreterRequired)
    }

    if (language) {
      this.languageField.set(language)
    }
  }
}
