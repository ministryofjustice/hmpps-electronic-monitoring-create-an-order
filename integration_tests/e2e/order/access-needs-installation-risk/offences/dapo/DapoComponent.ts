import FormComponent from '../../../../../pages/components/formComponent'
import FormDateComponent from '../../../../../pages/components/formDateComponent'
import FormInputComponent from '../../../../../pages/components/formInputComponent'

type DapoComonentFormData = {
  dapoClauseNumber?: string
  dapoDate?: Date
}

export default class DapoComponent extends FormComponent {
  get clauseNumberField(): FormInputComponent {
    const label = 'DAPO order clause number'
    return new FormInputComponent(this.form, label)
  }

  get dateField(): FormDateComponent {
    const label = 'Date of DAPO requirement'
    return new FormDateComponent(this.form, label)
  }

  fillInWith(data: DapoComonentFormData) {
    if (data.dapoClauseNumber) {
      this.clauseNumberField.set(data.dapoClauseNumber)
    }
    if (data.dapoDate) {
      this.dateField.set(data.dapoDate)
    }
  }
}
