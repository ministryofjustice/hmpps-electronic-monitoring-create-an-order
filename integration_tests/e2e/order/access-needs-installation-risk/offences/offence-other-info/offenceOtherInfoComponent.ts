import FormComponent from '../../../../../pages/components/formComponent'
import FormRadiosComponent from '../../../../../pages/components/formRadiosComponent'
import FormTextareaComponent from '../../../../../pages/components/formTextareaComponent'

export type OffenceOtherInfoInput = {
  hasOtherInformation?: 'Yes' | 'No'
  otherInformationDetails?: string
}
export default class OffenceOtherInfoComponent extends FormComponent {
  get hasOtherInformationField(): FormRadiosComponent {
    const label = 'Is there any other information to be aware of about the offence committed?'
    return new FormRadiosComponent(this.form, label, ['Yes', 'No'])
  }

  get otherInformationDetailsField(): FormTextareaComponent {
    const label = "Provide additional risk information about the device wearer's offence"
    return new FormTextareaComponent(this.form, label)
  }

  fillInWith(value: OffenceOtherInfoInput) {
    if (value.hasOtherInformation) {
      this.hasOtherInformationField.set(value.hasOtherInformation)
    }

    if (value.otherInformationDetails) {
      this.otherInformationDetailsField.set(value.otherInformationDetails)
    }
  }

  shouldNotBeDisabled(): void {
    this.hasOtherInformationField.shouldNotBeDisabled()
  }

  shouldHaveAllOptions(): void {
    this.hasOtherInformationField.shouldHaveAllOptions()
  }
}
