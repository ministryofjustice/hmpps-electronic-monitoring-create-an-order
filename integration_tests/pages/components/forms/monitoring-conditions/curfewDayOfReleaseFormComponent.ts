import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export default class CurfewDayOfReleaseFormComponent extends FormComponent {
  get standardCurfewTimesField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'On the day of release do you want to use the standard curfew times?', [
      'Yes',
      'No',
    ])
  }
}
