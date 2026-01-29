import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'

export default class ServiceRequestTypeComponent extends SingleQuestionFormComponent {
  get serviceRequestTypeField(): FormRadiosComponent {
    const label = 'Why are you making changes to the form?'
    return new FormRadiosComponent(this.form, label, [
      'I need monitoring equipment installed at an additional address',
      'I need monitoring equipment reinstalled',
      'I need to revoke monitoring for the device wearer',
      'I need to end all monitoring for a device wearer',
      'I need to change something else in the form',
    ])
  }

  fillInWith(value: string) {
    this.serviceRequestTypeField.set(value)
  }
}
