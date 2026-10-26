import { Response } from 'express'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { getError } from '../../../utils/validation/errorMessages'
import { FileRequiredViewModel } from '../court-order/viewModel'
import { NewDocumentFormData } from './formModel'

const convertBooleanToAnswer = (value: boolean | undefined | null): string => {
  if (value === true) return 'yes'
  if (value === false) return 'no'
  return ''
}

const construct = (
  order: Order,
  errors: ValidationResult,
  formData: NewDocumentFormData | undefined,
  res: Response,
): FileRequiredViewModel => {
  const content = res.locals.content?.pages.newDocument
  const question = content?.questions.newDocument ?? {}

  if (errors.length > 0) {
    return {
      title: content?.title,
      question,
      fileRequired: {
        value: formData?.fileRequired,
        error: getError(errors, 'fileRequired'),
      },
      errorSummary: createGovukErrorSummary(errors),
    }
  }

  return {
    title: content?.title,
    question,
    fileRequired: {
      value: convertBooleanToAnswer(order.orderParameters?.haveLicence),
    },
    errorSummary: null,
  }
}

export default construct
