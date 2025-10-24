import FormComponent from './formComponent'

export default abstract class SingleQuestionFormComponent extends FormComponent {
  abstract fillInWith(value: string)
}
