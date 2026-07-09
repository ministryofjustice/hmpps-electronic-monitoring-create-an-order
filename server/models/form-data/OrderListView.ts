import { z } from 'zod'

export const OrderListViewEnum = z.enum(['MY_ORDERS', 'FAILED_ORDERS', 'PRISON_ORDERS'])
export type OrderListView = z.infer<typeof OrderListViewEnum>

export const orderListViewLabels: Record<OrderListView, string> = {
  MY_ORDERS: 'My drafts',
  FAILED_ORDERS: 'My failed to submit',
  PRISON_ORDERS: 'My prison drafts',
}

export const ListOrdersQueryParser = z.object({
  view: OrderListViewEnum.catch('MY_ORDERS').default('MY_ORDERS'),
})
