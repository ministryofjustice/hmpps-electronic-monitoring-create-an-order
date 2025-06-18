import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'
import FormDateTimeComponent from '../../formDateTimeComponent'

export type InstallationAppointmentFormData = {
  placeName?: string
  appointmentDate?: Date
}

export default class InstallationAppointmentFormComponent extends FormComponent {
  // FIELDS

  get placeNameField(): FormInputComponent {
    const label = 'What is the name of the place where installation will take place?'
    return new FormInputComponent(this.form, label)
  }

  get appointmentDateField(): FormDateTimeComponent {
    return new FormDateTimeComponent(this.form, 'appointmentDate')
  }

  // FORM HELPERS

  fillInWith(profile: InstallationAppointmentFormData): void {
    if (profile.placeName) {
      this.placeNameField.set(profile.placeName)
    }

    if (profile.appointmentDate) {
      this.appointmentDateField.set(profile.appointmentDate)
    }
  }

  shouldBeValid(): void {
    this.placeNameField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.placeNameField.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.placeNameField.shouldNotBeDisabled()
  }
}
