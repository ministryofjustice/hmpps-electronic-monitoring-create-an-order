import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../../models/DeviceWearer'
import { Order } from '../../models/Order'
import { ValidationResult } from '../../models/Validation'
import { SanitisedError } from '../../sanitisedError'
import { convertBackendErrorToValidationError } from '../../utils/validation/errors'
import { DeviceWearerCache } from './store/model'
import DeviceWearerStoreService from './store/deviceWearerStoreService'

type SubmitDeviceWearerInput = AuthenticatedRequestInput & { order: Order }

export default class DeviceWearerAnswersService {
  constructor(
    private readonly store: DeviceWearerStoreService,
    private readonly apiClient: RestClient,
  ) {}

  getDeviceWearer(order: Order): Promise<DeviceWearerCache> {
    return this.store.getDeviceWearer(order)
  }

  async saveDeviceWearerDetails(
    _order: Order,
    _data: Pick<
      DeviceWearerCache,
      'firstName' | 'middleName' | 'lastName' | 'alias' | 'dateOfBirth' | 'sex' | 'gender'
    >,
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  async saveDisabilities(
    _order: Order,
    _data: Pick<DeviceWearerCache, 'disabilities' | 'otherDisability'>,
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  async saveLanguage(
    order: Order,
    { interpreterRequired, language }: Pick<DeviceWearerCache, 'interpreterRequired' | 'language'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, { interpreterRequired, language: interpreterRequired ? language : '' })
  }

  async saveAdultAtInstallation(
    _order: Order,
    _data: Pick<DeviceWearerCache, 'adultAtTimeOfInstallation'>,
  ): Promise<void> {
    throw new Error('Not implemented')
  }

  async submit({ accessToken, order }: SubmitDeviceWearerInput): Promise<DeviceWearer | ValidationResult> {
    const { disabilities, ...answers } = await this.store.getDeviceWearer(order)

    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${order.id}/device-wearer`,
        data: { ...answers, disabilities: (disabilities ?? []).join(',') },
        token: accessToken,
      })
      const deviceWearer = DeviceWearerModel.parse(result)
      await this.store.clearDeviceWearer(order)
      return deviceWearer
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
