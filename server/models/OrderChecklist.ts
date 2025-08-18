import { z } from 'zod'

const OrderChecklistModel = z.object({
  ABOUT_THE_DEVICE_WEARER: z.boolean().default(false),
  CONTACT_INFORMATION: z.boolean().default(false),
  RISK_INFORMATION: z.boolean().default(false),
  ELECTRONIC_MONITORING_CONDITIONS: z.boolean().default(false),
  ADDITIONAL_DOCUMENTS: z.boolean().default(false),
})

export type OrderChecklist = z.infer<typeof OrderChecklistModel>

export default OrderChecklistModel
