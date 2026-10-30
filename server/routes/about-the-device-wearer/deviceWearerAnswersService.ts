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

  // CPR does not provide a gender, so when a person is loaded from CPR without one the answer defaults to
  // 'Not able to provide this information'. The order should be the one the API stored after the lookup.
  async defaultGenderAfterCprLookup(order: Order): Promise<void> {
    const { gender } = await this.store.getDeviceWearer(order)
    if (!gender) {
      await this.store.updateDeviceWearer(order, { gender: 'NOT_ABLE_TO_PROVIDE_THIS_INFORMATION' })
    }
  }

  async saveDisabilities(
    order: Order,
    data: Pick<DeviceWearerCache, 'disabilities' | 'otherDisability'>,
  ): Promise<void> {
    await this.store.updateDeviceWearer(order, data)
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
          otherDisability: null,
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
