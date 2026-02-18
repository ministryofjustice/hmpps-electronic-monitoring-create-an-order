import SummaryListComponentWithoutHeading from '../../../../../pages/components/SummaryListComponentWithoutHeading'
import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'

export type OffenceListFormData = {
  addOffence?: string
  addDapoClause?: string
}

export default class OffenceListComponent extends FormComponent {
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

  fillInWith(input: OffenceListFormData) {
    if (input.addOffence) {
      this.addAnotherOffenceField.set(input.addOffence)
    }
    if (input.addDapoClause) {
      this.addAnotherDapoField.set(input.addDapoClause)
    }
  }
}
