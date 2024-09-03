import { QuestionValidator } from '../interfaces/questionValidator'
import NomisIdValidator from './validators/nomisIdValidator'

export default class ValidatorFactory {
  static validators: { [id: string]: QuestionValidator } = {
    'identifyNumbers-nomisId': new NomisIdValidator(),
  }

  static getValidator(sectionName: string, questionName: string): QuestionValidator {
    return this.validators[`${sectionName}-${questionName}`]
  }
}
