import { v4 as uuidv4 } from 'uuid'
import { Order } from '../models/Order'

type DeviceWearer = {
  orderId: string
  firstName: string
  lastName: string
  preferredName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'non-binary' | 'unknown' | 'self-identify'
}

const orders: Array<Order> = [
  {
    id: uuidv4(),
    status: 'SUBMITTED',
  },
  {
    id: uuidv4(),
    status: 'IN_PROGRESS',
  },
]

const deviceWearers: Array<DeviceWearer> = [
  {
    orderId: '0',
    firstName: 'Jane',
    lastName: 'Doe',
    preferredName: '',
    dateOfBirth: '1970-01-01',
    gender: 'female',
  },
]

export const getOrders = () => orders

export const getOrder = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const order = orders.find(order => order.id === id)

  if (order) {
    return order
  }

  throw new Error(`Could not find order ${id}`)
}

export const getDeviceWearer = (orderId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const deviceWearer = deviceWearers.find(deviceWearer => deviceWearer.orderId === orderId)

  if (deviceWearer) {
    return deviceWearer
  }

  throw new Error(`Could not find device wearer for order: ${orderId}`)
}

export { DeviceWearer, Order }
