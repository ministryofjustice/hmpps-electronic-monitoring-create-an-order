import z from 'zod'
import { OrderStatusEnum, OrderTypeEnum } from './Order'
import { AddressTypeEnum } from './Address'

const OrderSearchResultModel = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum,
  type: OrderTypeEnum,
  fmsResultDate: z.string().datetime().optional().nullable(),
  deviceWearer: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    dateOfBirth: z.string().datetime().nullable(),
    adultAtTimeOfInstallation: z.boolean().nullable(),
    nomisId: z.string().nullable(),
    pncId: z.string().nullable(),
    deliusId: z.string().nullable(),
    prisonNumber: z.string().nullable(),
    homeOfficeReferenceNumber: z.string().nullable(),
    complianceAndEnforcementPersonReference: z.string().nullable(),
    courtCaseReferenceNumber: z.string().nullable(),
  }),
  addresses: z.array(
    z.object({
      addressType: AddressTypeEnum,
      addressLine3: z.string(),
    }),
  ),
  monitoringConditions: z.object({
    startDate: z.string().datetime().nullable(),
    endDate: z.string().datetime().nullable(),
  }),
})
export const OrderSearchResultsModel = z.array(OrderSearchResultModel)
export type OrderSearchResult = z.infer<typeof OrderSearchResultModel>
export default OrderSearchResultModel
