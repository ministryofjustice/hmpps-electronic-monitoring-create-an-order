import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import SummaryListComponentWithoutHeading from '../../../../../pages/components/SummaryListComponentWithoutHeading'

export default class TypesOfMonitoringNeededComponent extends FormComponent {
  get summaryList(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }

  get addAnotherField(): FormRadiosComponent {
    const label = 'Are there any other types of monitoring needed for the device wearer?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    if (value) {
      this.addAnotherField.set(value)
    }
  }
}
