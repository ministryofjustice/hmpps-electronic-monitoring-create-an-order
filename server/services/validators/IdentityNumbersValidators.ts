import { Request } from 'express'
import { ValidationResult, SectionValidator, IQuestionValidator } from '../../interfaces/inputValidation'

export default class IdentityNumbersValidators implements SectionValidator {
  questionValidators: { [id: string]: IQuestionValidator } = {
    nomisId: this.ValidateNomisId,
    pndId: this.ValidatePndID,
  }

  ValidateNomisId(req: Request): ValidationResult {
    const result: ValidationResult = { success: false, errors: {}, nextPath: '' }
    const { nomisId } = req.body

    if (nomisId === undefined || nomisId === '') result.errors.nomisId = { text: 'Nomis ID must not be empty' }
    else {
      req.session.formData.nomisId = nomisId
      result.success = true
      result.nextPath = '/section/identitynumbers/question/pndId'
    }
    return result
  }

  ValidatePndID(req: Request): ValidationResult {
    const result: ValidationResult = { success: false, errors: {}, nextPath: '' }
    const { pndId } = req.body

    if (pndId === undefined || pndId === '') result.errors.pndId = { text: 'PND ID must not be empty' }
    else {
      req.session.formData.pndId = pndId
      result.success = true
      result.nextPath = `/section/${req.session.formData.id}/identityNumbers`
    }
    return result
  }
}
