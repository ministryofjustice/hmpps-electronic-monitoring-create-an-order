import FormComponent from '../../formComponent'
import FormTimeComponent, { FormTimeData } from '../../formTimeComponent'

export type CurfewReleaseDateFormData = {
  startTime?: FormTimeData
  endTime?: FormTimeData
}

export default class CurfewReleaseDateFormComponent extends FormComponent {
  // FIELDS

  get startTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day of release, what time does the curfew start?')
  }

  get endTimeField(): FormTimeComponent {
    return new FormTimeComponent(this.form, 'On the day after release, what time does the curfew end?')
  }

  // FORM HELPERS

  fillInWith(data: CurfewReleaseDateFormData): void {
    if (data.startTime) {
      this.startTimeField.set(data.startTime)
    }

    if (data.endTime) {
      this.endTimeField.set(data.endTime)
    }
  }

  shouldBeValid(): void {
    this.startTimeField.shouldNotHaveValidationMessage()
    this.endTimeField.shouldNotHaveValidationMessage()
  }

  shouldBeDisabled(): void {
    this.startTimeField.shouldBeDisabled()
    this.endTimeField.shouldBeDisabled()
  }
}
