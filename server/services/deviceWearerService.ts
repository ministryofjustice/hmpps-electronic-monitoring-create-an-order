import { getDeviceWearer } from '../data/inMemoryDatabase'

export default class DeviceWearerService {
  async getDeviceWearer(orderId: string) {
    try {
      return Promise.resolve(getDeviceWearer(orderId))
    } catch (e) {
      return Promise.resolve({
        orderId,
        firstName: '',
        lastName: '',
        preferredName: '',
        gender: '',
      })
    }
  }
}
