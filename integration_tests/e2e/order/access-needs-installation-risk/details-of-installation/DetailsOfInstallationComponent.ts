import FormCheckboxesComponent from '../../../../pages/components/formCheckboxesComponent'
import FormComponent from '../../../../pages/components/formComponent'
import FormTextareaComponent from '../../../../pages/components/formTextareaComponent'

export default class DetailsOfInstallationComponent extends FormComponent {
  get possibleRiskField(): FormCheckboxesComponent {
    const label = "At installation what are the possible risks from the device wearer's behaviour?"
    return new FormCheckboxesComponent(this.form, label, [
      'Offensive towards someone because of their sexual orientation',
      'Offensive towards someone because of their sex or gender',
      'Violent behaviour or threats of violence',
      'Sex offender',
      'Offensive towards someone because of their race, nationality, ethnicity or national origin',
      'There are no risks that the installer should be aware of',
    ])
  }

  get riskCategoryField(): FormCheckboxesComponent {
    const label = 'What are the possible risks at the installation address? (optional)'
    return new FormCheckboxesComponent(this.form, label, [
      'History of substance abuse',
      'Diversity concerns (mental health issues, learning difficulties etc)',
      'Managed through IOM',
      'Safeguarding adult',
      'Safeguarding child',
      'Safeguarding domestic abuse',
      'Another person or people living at the property who are threatening or violent',
      'Children under the age of 18 are living at the property',
      'Animals at the property, for example dogs',
      'Other known risks',
    ])
  }

  get riskDetailsField(): FormTextareaComponent {
    const label = 'Any other risks to be aware of? (optional)'
    return new FormTextareaComponent(this.form, label)
  }
}
