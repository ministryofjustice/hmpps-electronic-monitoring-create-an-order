type Order = {
  id: string
  title: string
  deviceWearer: {
    isComplete: boolean
  }
  contactDetails: {
    isComplete: boolean
  }
  status: 'Submitted' | 'Draft'
}

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
    id: '0',
    title: 'My new order',
    deviceWearer: {
      isComplete: true,
    },
    contactDetails: {
      isComplete: true,
    },
    status: 'Submitted',
  },
  {
    id: '1',
    title: 'My new order',
    deviceWearer: {
      isComplete: false,
    },
    contactDetails: {
      isComplete: false,
    },
    status: 'Draft',
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
