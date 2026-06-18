import FormCheckboxesComponent from '../../../../../pages/components/formCheckboxesComponent'
import FormComponent from '../../../../../pages/components/formComponent'
import FormDateComponent from '../../../../../pages/components/formDateComponent'

export type OffenceInput = {
  offenceType?: string
  offenceDate?: Date
}
export default class OffenceComponent extends FormComponent {
  get offenceTypeField(): FormCheckboxesComponent {
    const label = 'What type of offences did the device wearer commit?'
    return new FormCheckboxesComponent(this.form, label, [
      'Violence against the person',
      'Sexual offences',
      'Robbery',
      'Theft Offences',
      'Criminal damage and arson',
      'Drug offences',
      'Possession of weapons',
      'Public order offences',
      'Miscellaneous crimes against society',
      'Fraud Offences',
      'Summary Non-Motoring',
      'Summary motoring',
      'Offence not recorded',
    ])
  }

  get offenceDateField(): FormDateComponent {
    const label = 'What was the date of the offence?'
    return new FormDateComponent(this.form, label)
  }

  shouldNotBeDisabled(): void {
    this.offenceTypeField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.offenceTypeField.shouldHaveAllOptions()
  }

  fillInWith(value: OffenceInput) {
    if (value.offenceType) {
      this.offenceTypeField.set(value.offenceType)
    }
    if (value.offenceDate) {
      this.offenceDateField.set(value.offenceDate)
    }
  }
}
