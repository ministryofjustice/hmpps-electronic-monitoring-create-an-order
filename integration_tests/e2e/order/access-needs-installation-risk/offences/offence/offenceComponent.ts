import FormCheckboxesComponent from '../../../../../pages/components/formCheckboxesComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent' // Assuming this exists
import FormComponent from '../../../../../pages/components/formComponent'
import FormDateComponent from '../../../../../pages/components/formDateComponent'

export type OffenceInput = {
  offenceType?: string
  offenceDate?: Date
  isRadio?: boolean
}

export default class OffenceComponent extends FormComponent {
  private readonly offenceFieldLabel = 'What type of offences did the device wearer commit?'

  private readonly offenceLabels = [
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
  ]

  get offenceTypeCheckboxes(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(this.form, this.offenceFieldLabel, this.offenceLabels)
  }

  get offenceTypeRadios(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, this.offenceFieldLabel, this.offenceLabels)
  }

  get offenceDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What was the date of the offence?')
  }

  getOffenceTypeField(isRadio = false) {
    return isRadio ? this.offenceTypeRadios : this.offenceTypeCheckboxes
  }

  shouldNotBeDisabled(isRadio = false): void {
    this.getOffenceTypeField(isRadio).shouldNotBeDisabled()
  }

  shouldHaveAllOptions(isRadio = false): void {
    this.getOffenceTypeField(isRadio).shouldHaveAllOptions()
  }

  fillInWith(value: OffenceInput) {
    if (value.offenceType) {
      this.getOffenceTypeField(value.isRadio).set(value.offenceType)
    }
    if (value.offenceDate) {
      this.offenceDateField.set(value.offenceDate)
    }
  }
}
