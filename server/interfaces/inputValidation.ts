import { Request } from 'express'

export interface ValidationResult {
  success: boolean
  nextPath?: string
  errors?: { [id: string]: ErrorMessage }
}

export interface ErrorMessage {
  text: string
}

export interface IQuestionValidator {
  (req: Request): ValidationResult
}

export interface SectionValidator {
  questionValidators: { [id: string]: IQuestionValidator }
}
