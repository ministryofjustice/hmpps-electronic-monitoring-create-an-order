import FormAddressComponent, { FormAddressData } from '../../../../../pages/components/formAddressComponent'
import FormComponent from '../../../../../pages/components/formComponent'
import FormDateComponent from '../../../../../pages/components/formDateComponent'
import FormInputComponent from '../../../../../pages/components/formInputComponent'
import FormTimeComponent, { FormTimeData } from '../../../../../pages/components/formTimeComponent'

type AttendanceMonitoringAddToListFormData = {
  startDate?: Date
  endDate?: Date
  purpose?: string
  appointmentDay?: string
  startTime?: FormTimeData
  endTime?: FormTimeData
  address?: FormAddressData
}

export default class AttendanceMonitoringAddToListFormComponent extends FormComponent {
  // FIELDS

  get startDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does mandatory attendance monitoring start?')
  }

  get endDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date does mandatory attendance monitoring end?')
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

  // FORM HELPERS

  fillInWith(data: AttendanceMonitoringAddToListFormData) {
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
