import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type InstallationLocationFormData = {
  location?: string
}

export default class InstallationLocationFormComponent extends FormComponent {
  // FIELDS

  get locationField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Where will installation of the electronic monitoring device take place?',
      ['At a prison', 'At a probation office'],
    )
  }

  // FORM HELPERS

  fillInWith(profile: InstallationLocationFormData): void {
    if (profile.location) {
      this.locationField.set(profile.location)
    }
  }

  shouldBeValid(): void {
    this.locationField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.locationField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.locationField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.locationField.shouldHaveAllOptions()
  }
}
