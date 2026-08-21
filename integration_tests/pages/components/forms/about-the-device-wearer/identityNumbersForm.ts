import { IdentityNumberFieldName } from '../../../../../server/constants/identityNumbers'
import content from '../../../../../server/i18n/en/pages/identityNumbers'
import FormCheckboxesComponent from '../../formCheckboxesComponent'
import FormComponent from '../../formComponent'
import FormInputComponent from '../../formInputComponent'

export type IdentityNumberName = IdentityNumberFieldName

export type IdentityNumbersFormData = Partial<Record<IdentityNumberName, string>>

export default class IdentityNumbersFormComponent extends FormComponent {
  constructor(private readonly options: IdentityNumberName[] = ['pncId', 'nomisId']) {
    super()
  }

  get checkboxes(): FormCheckboxesComponent {
    return new FormCheckboxesComponent(
      this.form,
      content.legend,
      this.options.map(name => content.questions[name].text),
    )
  }

  field(name: IdentityNumberName): FormInputComponent {
    return new FormInputComponent(this.form, content.inputLabels[name])
  }

  singleField(name: IdentityNumberName): FormInputComponent {
    return new FormInputComponent(this.form, content.singleQuestionTitles[name])
  }

  fillInWith = (profile: IdentityNumbersFormData): undefined => {
    if (this.options.length === 1) {
      const [name] = this.options
      const value = profile[name]

      if (value) {
        this.singleField(name).set(value)
      }

      return
    }

    this.options.forEach(name => {
      const value = profile[name]

      if (value) {
        this.checkboxes.set(content.questions[name].text)
        this.field(name).set(value)
      }
    })
  }

  shouldBeValid(): void {
    this.options.forEach(name => this.field(name).shouldNotHaveValidationMessage())
  }

  shouldBeDisabled(): void {
    this.checkboxes.shouldBeDisabled()
  }

  shouldNotBeDisabled(): void {
    this.checkboxes.shouldNotBeDisabled()
  }
}
