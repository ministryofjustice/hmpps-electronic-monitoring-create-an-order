import z from 'zod'
import { BooleanInputModel } from './formData'

const NoFixedAbodeFormDataModel = z.object({
  action: z.string().default('continue'),
  noFixedAbode: BooleanInputModel,
})

type NoFixedAbodeFormData = Omit<z.infer<typeof NoFixedAbodeFormDataModel>, 'action'>

export default NoFixedAbodeFormDataModel

export { NoFixedAbodeFormData }
