import z from 'zod'
import { YesNoUnknownEnum } from '../../monitoring-conditions/model'
import { validationErrors } from '../../../constants/validationErrors'

const IsMappaFormModel = z.object({
  action: z.string(),
  isMappa: z.string().optional(),
})

export const IsMappaFormValidator = z.object({
  isMappa: z.enum(YesNoUnknownEnum.options, {
    message: validationErrors.isMappa.required,
  }),
})

export type IsMappaInput = z.infer<typeof IsMappaFormModel>
export default IsMappaFormModel
