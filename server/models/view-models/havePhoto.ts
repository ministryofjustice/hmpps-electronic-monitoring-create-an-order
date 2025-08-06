import { Request } from 'express'
import { z } from 'zod'
import { ErrorSummary } from '../../utils/govukFrontEndTypes/errorSummary'
import { ErrorMessage } from './utils'
import { getError } from '../../utils/utils'
import { ValidationResult } from '../Validation'
import { createGovukErrorSummary } from '../../utils/errors'

type HavePhotoModel = {
  havePhoto: {
    value?: string
    error?: ErrorMessage
  }
  errorSummary: ErrorSummary | null
}

export const HavePhotoFormDataModel = z.object({
  action: z.string(),
  havePhoto: z
    .enum(['yes', 'no'])
    .optional()
    .transform(val => {
      if (val === 'yes') {
        return true
      }
      if (val === 'no') {
        return false
      }
      return null
    }),
})

export type HavePhotoFormData = Omit<z.infer<typeof HavePhotoFormDataModel>, 'action'>

export class HavePhotoModelService {
  public buildHavePhotoModel(req: Request): HavePhotoModel {
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    const formData = req.flash('formData') as unknown as HavePhotoFormData[]
    const model: HavePhotoModel = { havePhoto: {}, errorSummary: null }

    if (errors) {
      model.havePhoto.error = getError(errors, 'havePhoto')
      model.errorSummary = createGovukErrorSummary(errors)
    }

    if (formData.length && formData[0].havePhoto) {
      model.havePhoto.value = this.convertHavePhotoBoolToString(formData[0].havePhoto)
    }

    return model
  }

  private convertHavePhotoBoolToString(havePhoto: boolean | undefined): string {
    if (havePhoto === true) return 'yes'
    if (havePhoto === false) return 'no'
    return ''
  }
}
