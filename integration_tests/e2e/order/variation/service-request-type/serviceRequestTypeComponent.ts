import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class ServiceRequestTypeComponent extends SingleQuestionFormComponent {
  get serviceRequestTypeField(): FormRadiosComponent {
    const label = 'Why are you making changes to the form?'
    return new FormRadiosComponent(this.form, label, [
      'The device wearer has been recalled to prison.',
      "The device wearer's circumstances have changed and all monitoring needs to end.",
      'The device wearer needs to remain at a second or third address during curfew hours.',
      'There is an issue with the equipment and it needs checking or refitted',
      'The Responsible Officer has changed',
      'I need to change something else in the form',
    ])
  }

  fillInWith(value: string) {
    this.serviceRequestTypeField.set(value)
  }
}
