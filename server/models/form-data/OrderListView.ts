import { z } from 'zod'

export const OrderListViewEnum = z.enum(['MY_DRAFTS', 'FAILED_ORDERS', 'PRISON_ORDERS'])
export type OrderListView = z.infer<typeof OrderListViewEnum>
// prolly donty need
export const orderListViewLabels: Record<OrderListView, string> = {
  MY_DRAFTS: 'My drafts',
  FAILED_ORDERS: 'My failed to submit',
  PRISON_ORDERS: 'My prison drafts'
}

export const ListOrdersQueryParser = z.object({
  view: OrderListViewEnum.catch('MY_DRAFTS').default('MY_DRAFTS'),
})