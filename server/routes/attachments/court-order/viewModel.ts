import { Response } from 'express'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { FileRequiredFormData } from '../fileRequiredFormModel'
import FileRequiredViewModel from '../fileRequiredViewModel'
import { getError } from '../../../utils/validation/errorMessages'
import { convertBooleanToEnum } from '../../../utils/values'

const createFromEntity = (order: Order, res: Response): FileRequiredViewModel => {
  return {
    title: res.locals.content?.pages.haveCourtOrder.title,
    question: {
      text: res.locals.content?.pages.haveCourtOrder.questions.haveCourtOrder.text,
    },
    fileRequired: {
      value: convertBooleanToEnum(order.orderParameters?.haveCourtOrder, '', 'yes', 'no'),
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

export default contructModel
