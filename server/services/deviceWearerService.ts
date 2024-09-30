import DeviceWearerModel from '../models/DeviceWearer'

export default class DeviceWearerService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDeviceWearer(orderId: string) {
    try {
      return Promise.resolve(
        DeviceWearerModel.parse({
          firstName: '',
          lastName: '',
          preferredName: '',
          gender: '',
          dateOfBirth: '',
        }),
      )
    } catch (e) {
      return Promise.resolve(
        DeviceWearerModel.parse({
          firstName: '',
          lastName: '',
          preferredName: '',
          gender: '',
          dateOfBirth: '',
        }),
      )
    }
  }
}
