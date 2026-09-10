import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export default class CurfewTimetableQuestionFormComponent extends FormComponent {
  get standardCurfewTimesField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Do you want to use the standard curfew times for the curfew timetable?',
      ['Yes', 'No'],
    )
  }
}
