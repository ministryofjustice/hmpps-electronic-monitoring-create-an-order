import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'
import SummaryListComponentWithoutHeading from '../../../../../pages/components/SummaryListComponentWithoutHeading'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export default class OffenceListComponent extends SingleQuestionFormComponent {
  get summaryList(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }

  get addAnotherOffenceField(): FormRadiosComponent {
    const label = 'Are there any other offences that the device wearer has committed?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get addAnotherDapoField(): FormRadiosComponent {
    const label = 'Are there any other DAPO order clauses?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  fillInWith(value: string) {
    throw new Error(`Method not implemented.${value}`)
  }
}
