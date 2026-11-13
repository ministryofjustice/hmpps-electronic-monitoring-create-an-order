import z from 'zod'
import { validationErrors } from '../../../constants/validationErrors'

const CheckRiskFormModel = z.object({
  action: z.string(),
  checkRisk: z.string().optional(),
})

export const CheckRiskFormValidator = z.object({
  checkRisk: z.enum(['YES', 'NO'], {
    message: validationErrors.checkRisk.required,
  }),
})

export type CheckRiskInput = z.infer<typeof CheckRiskFormModel>
export default CheckRiskFormModel
