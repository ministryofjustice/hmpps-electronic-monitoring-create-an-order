import { Response } from 'express'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { createGovukErrorSummary } from '../../../utils/validation/errors'
import { getError } from '../../../utils/validation/errorMessages'
import { convertBooleanToEnum } from '../../../utils/values'
import FileRequiredViewModel from '../fileRequiredViewModel'
import { FileRequiredFormData } from '../fileRequiredFormModel'

const construct = (
  order: Order,
  errors: ValidationResult,
  formData: FileRequiredFormData | undefined,
  res: Response,
): FileRequiredViewModel => {
  const content = res.locals.content?.pages.newDocument
  const hasErrors = errors.length > 0

  return {
    title: content?.title,
    question: content?.questions.newDocument ?? {},
    fileRequired: hasErrors
      ? { value: formData?.fileRequired, error: getError(errors, 'fileRequired') }
      : { value: convertBooleanToEnum(order.orderParameters?.haveLicence, '', 'yes', 'no') },
    errorSummary: hasErrors ? createGovukErrorSummary(errors) : null,
  }
}

export default construct
