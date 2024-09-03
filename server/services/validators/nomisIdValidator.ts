import { Request } from 'express'
import { ValidationResult, QuestionValidator } from '../../interfaces/questionValidator'

export default class NomisIdValidator implements QuestionValidator {
  validate(req: Request): ValidationResult {
    const result: ValidationResult = { success: false, errors: {} }
    const { nomisId } = req.body

    if (nomisId === undefined || nomisId === '') result.errors.nomisId = { text: 'Nomis ID must not be empty' }
    else {
      req.session.formData.nomisId = nomisId
      result.success = true
    }
    return result
  }
}
