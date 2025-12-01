import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class ServiceRequestTypeComponent extends SingleQuestionFormComponent {
  get serviceRequestTypeField(): FormRadiosComponent {
    const label = 'Why are you making changes to the form?'
    return new FormRadiosComponent(this.form, label, [
      'I need monitoring equipment installed at a new address',
      'I need monitoring equipment reinstalled or checked',
      'I need to end all monitoring for the device wearer',
      'I need to change something else in the form',
    ])
  }

  fillInWith(value: string) {
    this.serviceRequestTypeField.set(value)
  }
}
