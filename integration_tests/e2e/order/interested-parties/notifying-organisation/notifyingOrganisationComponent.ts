import FormComponent from '../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import FormTextareaComponent from '../../../../pages/components/formTextareaComponent'

export default class NotifyingOrganisationComponent extends FormComponent {
  get organisationField(): FormRadiosComponent {
    const label = 'What organisation or related organisation are you part of?'
    return new FormRadiosComponent(this.form, label, [
      'Prison service',
      'Probation service',
      'Youth Custody Service (YCS)',
      'Crown Court',
      'Magistrates Court',
      'Family Court',
      'Civil and County Court',
      'Youth Court',
      'Scottish Court',
      'Military Court',
      'Home Office',
    ])
  }

  get emailField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, "What is your team's contact email address?")
  }

  fillInWith({ organisation, email }: { organisation: string; email: string }) {
    if (organisation) {
      this.organisationField.set(organisation)
    }
    if (email) {
      this.emailField.set(email)
    }
  }
}
