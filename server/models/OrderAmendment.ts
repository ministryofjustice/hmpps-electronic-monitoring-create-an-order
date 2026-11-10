import z from 'zod'
import OrderModel from './Order'

export const OrderAmendmentOutcomeEnum = z.enum(['ACCEPTED', 'REJECTED'])

const OrderAmendmentModel = z.object({
  order: OrderModel,
  outcome: OrderAmendmentOutcomeEnum,
})

export type OrderAmendment = z.infer<typeof OrderAmendmentModel>
export type OrderAmendmentOutcome = z.infer<typeof OrderAmendmentOutcomeEnum>
export default OrderAmendmentModel
