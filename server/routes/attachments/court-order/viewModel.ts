import { Response } from 'express'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { Question } from '../../../types/i18n/pages/questionPage'
import { ErrorMessage } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { ErrorSummary } from '../../../utils/views/govukFrontEndTypes/errorSummary'
import { FileRequiredFormData } from '../fileRequiredFormModel'
import { getError } from '../../../utils/validation/errorMessages'

export type FileRequiredViewModel = {
  title?: string
  question: Partial<Question>
  fileRequired: {
    value?: string | undefined | null
    error?: ErrorMessage
  }
  errorSummary: ErrorSummary | null
}

const createFromEntity = (order: Order, res: Response): FileRequiredViewModel => {
  return {
    title: res.locals.content?.pages.haveCourtOrder.title,
    question: {
      text: res.locals.content?.pages.haveCourtOrder.questions.haveCourtOrder.text,
    },
    fileRequired: {
      value: convertHavePhotoBoolToString(order.orderParameters?.haveCourtOrder),
    },
    errorSummary: null,
  }
}

const createFromFormData = (
  errors: ValidationResult,
  formData: FileRequiredFormData,
  res: Response,
): FileRequiredViewModel => {
  return {
    title: res.locals.content?.pages.haveCourtOrder.title,
    question: {
      text: res.locals.content?.pages.haveCourtOrder.questions.haveCourtOrder.text,
    },
    fileRequired: {
      value: formData.fileRequired,
      error: getError(errors, 'fileRequired'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}
const contructModel = (
  data: Order,
  errors: ValidationResult,
  formData: FileRequiredFormData,
  res: Response,
): FileRequiredViewModel => {
  if (errors.length > 0) {
    return createFromFormData(errors, formData, res)
  }
  return createFromEntity(data, res)
}

const convertHavePhotoBoolToString = (fileRequired: boolean | undefined | null): string => {
  if (fileRequired === true) return 'yes'
  if (fileRequired === false) return 'no'
  return ''
}

export default contructModel
