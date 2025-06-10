import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'

export type InstallationLocationFormData = {
  location?: string
}

export default class InstallationLocationFormComponent extends FormComponent {
  // FIELDS

  get unitField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'Where will installation of the electronic monitoring device take place?',
      ['At another address'],
    )
  }

  // FORM HELPERS

  fillInWith(profile: InstallationLocationFormData): void {
    if (profile.location) {
      this.unitField.set(profile.location)
    }
  }

  shouldBeValid(): void {
    this.unitField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.unitField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.unitField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.unitField.shouldHaveAllOptions()
  }
}
