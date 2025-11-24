import FormComponent from '../../formComponent'
import FormRadiosComponent from '../../formRadiosComponent'
import FormTimeComponent, { FormTimeData } from '../../formTimeComponent'

export type CurfewReleaseDateFormData = {
  startTime?: FormTimeData
  endTime?: FormTimeData
  address?: string | RegExp
}

export default class CurfewReleaseDateFormComponent extends FormComponent {
  // FIELDS

  get startTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day of release, what time does the curfew start?')
  }

  get endTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day after release, what time does the curfew end?')
  }

  get addressField(): FormRadiosComponent {
    return new FormRadiosComponent(
      this.form,
      'On the day of release, where will the device wearer be during curfew hours?',
      [/Main address/, /Second address/, /Third address/],
    )
  }

  // FORM HELPERS

  fillInWith(data: CurfewReleaseDateFormData): void {
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
    this.startTimeField.shouldNotHaveValidationMessage()
    this.endTimeField.shouldNotHaveValidationMessage()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startTimeField.shouldBeDisabled()
    this.endTimeField.shouldBeDisabled()
    this.addressField.shouldNotHaveValidationMessage()
  }

  shouldHaveAllOptions(): void {
    this.addressField.shouldHaveAllOptions()
  }
}
