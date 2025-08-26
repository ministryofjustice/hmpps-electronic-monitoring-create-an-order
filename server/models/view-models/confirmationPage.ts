import { Order } from '../Order'
import { ConfirmationPageViewModel } from './utils'

const createFromEntity = (order: Order): ConfirmationPageViewModel => {
  return {
    order: {
      id: order.id,
    },
    deviceWearer: {
      firstName: order.deviceWearer.firstName || '',
      lastName: order.deviceWearer.lastName || '',
    },
  }
}

const construct = (order: Order): ConfirmationPageViewModel => {
  return createFromEntity(order)
}

export default {
  construct,
}
