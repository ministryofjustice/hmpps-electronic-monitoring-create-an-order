import FormComponent from '../../../../../pages/components/formComponent'
import FormDateComponent from '../../../../../pages/components/formDateComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OffenceComponent extends FormComponent {
  get offenceTypeField(): FormRadiosComponent {
    const label = 'What type of offence did the device wearer commit?'
    return new FormRadiosComponent(this.form, label, [
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

  fillInWith(value: string) {
    // TODO implement fillInWith method
    throw new Error(`Method not implemented.${value}`)
  }
}
