import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import SummaryListComponentWithoutHeading from '../../../../pages/components/SummaryListComponentWithoutHeading'

export default class AddressListComponent extends SingleQuestionFormComponent {
  fillInWith(value: string) {
    this.additionalAddresses.set(value)
  }

  get summaryList(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }

  get additionalAddresses(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Are there any other addresses where the device wearer will be during curfew hours?',
      ['Yes', 'No'],
    )
  }
}
