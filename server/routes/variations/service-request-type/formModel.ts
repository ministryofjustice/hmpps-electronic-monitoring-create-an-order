import { z } from 'zod'

export const ServiceRequestTypeFormDataModel = z.object({
  action: z.string(),
  serviceRequestType: z.string().nullable().optional(),
})

export default ServiceRequestTypeFormDataModel
