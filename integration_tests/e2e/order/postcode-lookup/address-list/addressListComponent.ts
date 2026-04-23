import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import SummaryListComponentWithoutHeading from '../../../../pages/components/SummaryListComponentWithoutHeading'

export default class AddressListComponent extends SingleQuestionFormComponent {
  fillInWith(value: string) {
    // TODO implement fillInWith method
    throw new Error(`Method not implemented.${value}`)
  }

  get summaryList(): SummaryListComponentWithoutHeading {
    return new SummaryListComponentWithoutHeading()
  }
}
