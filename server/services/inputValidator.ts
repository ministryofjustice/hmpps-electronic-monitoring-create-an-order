import { Request } from 'express'
import { SectionValidator, ValidationResult } from '../interfaces/inputValidation'
import IdentifyNumbersValidators from './validators/IdentifyNumbersValidators'

export default class InputValidator {
  static validators: { [id: string]: SectionValidator } = {
    identifynumbers: new IdentifyNumbersValidators(),
  }

  static validateInput(req: Request): ValidationResult {
    const currentPage = req.session.returnTo.split('/')
    const section = currentPage[2]
    const question = currentPage[3]
    const sectionValidator = this.validators[section]
    const questionValidator = sectionValidator?.questionValidators[question]
    if (sectionValidator === undefined || questionValidator === undefined) return { success: false }

    return questionValidator(req)
  }
}
