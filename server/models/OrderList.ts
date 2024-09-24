import z from 'zod'
import OrderModel from './Order'

const OrderListModel = z.array(OrderModel)

export type OrderList = z.infer<typeof OrderListModel>

export default OrderListModel
