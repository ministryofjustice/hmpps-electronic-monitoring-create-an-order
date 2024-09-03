import { Request } from 'express'

export class ValidationResult {
  success: boolean

  errors: { [id: string]: ErrorMessage }
}

export interface ErrorMessage {
  text: string
}

export interface QuestionValidator {
  validate(req: Request): ValidationResult
}
