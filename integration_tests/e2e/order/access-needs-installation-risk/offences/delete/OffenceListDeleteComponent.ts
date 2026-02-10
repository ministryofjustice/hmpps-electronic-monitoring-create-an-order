import SingleQuestionFormComponent from '../../../../../pages/components/SingleQuestionFormComponent'

export default class OffenceDeleteComponent extends SingleQuestionFormComponent {
  fillInWith(value: string) {
    // TODO implement fillInWith method
    throw new Error(`Method not implemented.${value}`)
  }

  containsHint(hint: string) {
    return cy.contains(hint)
  }
}
