import SingleQuestionFormComponent from '../../../../pages/components/SingleQuestionFormComponent'
import FormRadiosComponent from '../../../../pages/components/formRadiosComponent'
import FormTextareaComponent from '../../../../pages/components/formTextareaComponent'

export const OTHER_RISKS_QUESTION = 'Are there other risks to be aware of?'
export const OTHER_RISKS_DETAILS_LABEL = 'What other risks are there to be aware of?'
export const OTHER_RISKS_DETAILS_HINT =
  'Information subject to sensitive processing must only be shared with the offenders consent or where strictly necessary for the purpose of the EMS managing risk.'

export default class OtherRisksComponent extends SingleQuestionFormComponent {
  get hasOtherRisksField(): FormRadiosComponent {
    return new FormRadiosComponent(this.form, OTHER_RISKS_QUESTION, ['Yes', 'No'], true)
  }

  get otherRisksDetailsField(): FormTextareaComponent {
    return new FormTextareaComponent(this.form, OTHER_RISKS_DETAILS_LABEL)
  }

  fillInWith(hasOtherRisks: 'Yes' | 'No', details?: string) {
    this.hasOtherRisksField.set(hasOtherRisks)
    if (details) {
      this.otherRisksDetailsField.set(details)
    }
  }
}
