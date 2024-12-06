import { z } from 'zod'
import { OrderTypeEnum } from '../Order'

const CreateOrderFormDataParser = z.object({
  type: OrderTypeEnum,
})

type CreateOrderFormData = z.infer<typeof CreateOrderFormDataParser>

export { CreateOrderFormData, CreateOrderFormDataParser }
