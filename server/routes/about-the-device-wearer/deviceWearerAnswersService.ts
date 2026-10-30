import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import DeviceWearerModel, { DeviceWearer } from '../../models/DeviceWearer'
import { Order } from '../../models/Order'
import { ValidationResult } from '../../models/Validation'
import { SanitisedError } from '../../sanitisedError'
import {
  NO_RESPONSIBLE_ADULT_REQUIRED,
  shouldAskResponsibleAdultQuestion,
} from '../../utils/order/responsibleAdultQuestion'
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
    order: Order,
    data: Pick<DeviceWearerCache, 'firstName' | 'middleName' | 'lastName' | 'alias' | 'dateOfBirth' | 'sex' | 'gender'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, data)
  }

  async saveDisabilities(
    order: Order,
    { disabilities, otherDisability }: Pick<DeviceWearerCache, 'disabilities' | 'otherDisability'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, {
      disabilities,
      otherDisability: disabilities?.includes('OTHER') ? otherDisability : '',
    })
  }

  async saveLanguage(
    order: Order,
    { interpreterRequired, language }: Pick<DeviceWearerCache, 'interpreterRequired' | 'language'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, { interpreterRequired, language: interpreterRequired ? language : '' })
  }

  async saveAdultAtInstallation(
    order: Order,
    { adultAtTimeOfInstallation }: Pick<DeviceWearerCache, 'adultAtTimeOfInstallation'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, { adultAtTimeOfInstallation })
  }

  async submit({ accessToken, order }: SubmitDeviceWearerInput): Promise<DeviceWearer | ValidationResult> {
    // Only send the answers the device wearer pages own (the fields of the API's UpdateDeviceWearerDto)
    const {
      firstName,
      middleName,
      lastName,
      alias,
      dateOfBirth,
      sex,
      gender,
      disabilities,
      otherDisability,
      interpreterRequired,
      language,
      adultAtTimeOfInstallation,
    } = shouldAskResponsibleAdultQuestion(order)
      ? await this.store.getDeviceWearer(order)
      : { ...(await this.store.getDeviceWearer(order)), ...NO_RESPONSIBLE_ADULT_REQUIRED }

    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${order.id}/device-wearer`,
        data: {
          firstName,
          middleName,
          lastName,
          alias,
          dateOfBirth,
          sex,
          gender,
          disabilities: (disabilities ?? []).join(','),
          otherDisability: disabilities?.includes('OTHER') ? otherDisability : null,
          interpreterRequired,
          language,
          adultAtTimeOfInstallation,
        },
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
