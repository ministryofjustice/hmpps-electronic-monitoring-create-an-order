import FormComponent from '../../formComponent'
import FormDateComponent from '../../formDateComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormTimeComponent, { FormTimeData } from '../../formTimeComponent'

export type CurfewReleaseDateFormData = {
  releaseDate?: Date
  startTime?: FormTimeData
  endTime?: FormTimeData
  address?: string | RegExp
}

export default class CurfewReleaseDateFormComponent extends FormComponent {
  // FIELDS

  get releaseDateField(): FormDateComponent {
    return new FormDateComponent(this.form, 'What date is the device wearer released from custody?')
  }

  get startTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day of release, what time does the curfew start?')
  }

  get endTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day of release, what time does the curfew end?')
  }

  get addressField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, 'Curfew address on the day of release', [
      /Main address/,
      /Second address/,
      /Third address/,
    ])
  }

  // FORM HELPERS

  fillInWith(data: CurfewReleaseDateFormData): void {
    if (data.releaseDate) {
      this.releaseDateField.set(data.releaseDate)
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

  shouldBeValid(): void {
    this.releaseDateField.shouldNotHaveValidationMessage()
    this.startTimeField.shouldNotHaveValidationMessage()
    this.endTimeField.shouldNotHaveValidationMessage()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.releaseDateField.shouldBeDisabled()
    this.startTimeField.shouldBeDisabled()
    this.endTimeField.shouldBeDisabled()
    this.addressField.shouldNotHaveValidationMessage()
  }
}
