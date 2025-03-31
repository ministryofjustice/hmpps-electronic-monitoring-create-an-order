import FormAddressComponent, { FormAddressData } from '../../formAddressComponent'
import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormInputComponent from '../../formInputComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormTimeComponent, { FormTimeData } from '../../formTimeComponent'

type AttendanceMonitoringFormData = {
  startDate?: Date
  endDate?: Date
  purpose?: string
  appointmentDay?: string
  startTime?: FormTimeData
  endTime?: FormTimeData
  address?: FormAddressData
  addAnother?: string
}

export default class AttendanceMonitoringFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does mandatory attendance monitoring start?')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does mandatory attendance monitoring end? (optional)')
  }

  get purposeField(): FormInputComponent {
    return new FormInputComponent(this.form, 'What is the appointment for?')
  }

  get appointmentDayField(): FormInputComponent {
    return new FormInputComponent(
      this.form,
      'On what day is the appointment and how frequently does the appointment take place?',
    )
  }

  get startTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'What time does the appointment start')
  }

  get endTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'What time does the appointment end?')
  }

  get addressField(): FormAddressComponent {
    return new FormAddressComponent(this.form, 'At what address will the appointment take place?')
  }

  get addAnotherField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Do you need to add another appointment?', ['Yes', 'No'])
  }

  // FORM HELPERS
  fillInWith(data: AttendanceMonitoringFormData) {
    if (data.startDate) {
      this.startDateField.set(data.startDate)
    }

    if (data.endDate) {
      this.endDateField.set(data.endDate)
    }

    if (data.purpose) {
      this.purposeField.set(data.purpose)
    }

    if (data.appointmentDay) {
      this.appointmentDayField.set(data.appointmentDay)
    }

    if (data.startTime) {
      this.startTimeField.set(data.startTime)
    }

    if (data.endTime) {
      this.endTimeField.set(data.endTime)
    }

    if (data.address) {
      this.addressField.set(data.address)
    }

    if (data.addAnother) {
      this.addAnotherField.set(data.addAnother)
    }
  }

  shouldBeValid() {
    this.startDateField.shouldNotHaveValidationMessage()
    this.endDateField.shouldNotHaveValidationMessage()
    this.purposeField.shouldNotHaveValidationMessage()
    this.appointmentDayField.shouldNotHaveValidationMessage()
    this.startTimeField.shouldNotHaveValidationMessage()
    this.endTimeField.shouldNotHaveValidationMessage()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled() {
    this.startDateField.shouldBeDisabled()
    this.endDateField.shouldBeDisabled()
    this.purposeField.shouldBeDisabled()
    this.appointmentDayField.shouldBeDisabled()
    this.startTimeField.shouldBeDisabled()
    this.endTimeField.shouldBeDisabled()
    this.addressField.shouldBeDisabled()
  }

  shouldNotBeDisabled() {
    this.startDateField.shouldNotBeDisabled()
    this.endDateField.shouldNotBeDisabled()
    this.purposeField.shouldNotBeDisabled()
    this.appointmentDayField.shouldNotBeDisabled()
    this.startTimeField.shouldNotBeDisabled()
    this.endTimeField.shouldNotBeDisabled()
    this.addressField.shouldNotBeDisabled()
  }
}
