import { z } from 'zod'
import type { Cohort } from '../UserCohort'

export const OrderListViewEnum = z.enum(['MY_ORDERS', 'FAILED_ORDERS', 'PRISON_ORDERS', 'HOME_OFFICE_ORDERS'])
export type OrderListView = z.infer<typeof OrderListViewEnum>

export const orderListViewLabels: Record<OrderListView, string> = {
  MY_ORDERS: 'My drafts',
  FAILED_ORDERS: 'My failed to submit',
  PRISON_ORDERS: `My prison's forms`,
  HOME_OFFICE_ORDERS: 'Home Office forms',
}

export const DEFAULT_ORDER_LIST_PAGE_SIZE = 20

export const getOrderListViewsForCohort = (cohort?: Cohort): OrderListView[] => {
  if (cohort === 'PRISON') {
    return ['MY_ORDERS', 'FAILED_ORDERS', 'PRISON_ORDERS']
  }
  if (cohort === 'HOME_OFFICE') {
    return ['MY_ORDERS', 'FAILED_ORDERS', 'HOME_OFFICE_ORDERS']
  }
  return ['MY_ORDERS', 'FAILED_ORDERS']
}

export const emptyListMessages: Record<OrderListView, string> = {
  MY_ORDERS: 'You have no draft or returned forms',
  FAILED_ORDERS: 'You have no failed to submit forms',
  PRISON_ORDERS: 'Your prison has no draft or returned forms',
  HOME_OFFICE_ORDERS: 'Your team has no draft or returned forms',
}

export const ListOrdersQueryParser = z.object({
  view: OrderListViewEnum.catch('MY_ORDERS').default('MY_ORDERS'),
  page: z.coerce.number().int().nonnegative().catch(0),
  size: z.coerce.number().int().positive().catch(DEFAULT_ORDER_LIST_PAGE_SIZE),
})
