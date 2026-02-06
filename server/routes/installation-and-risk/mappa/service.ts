import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import MappaModel, { Mappa } from '../../../models/MappaModel'
import { ValidationResult } from '../../../models/Validation'
import { SanitisedError } from '../../../sanitisedError'
import { convertBackendErrorToValidationError } from '../../../utils/errors'
import { IsMappaInput } from '../is-mappa/formModel'
import { MappaInput } from './formModel'

type UpdateMappaInput = AuthenticatedRequestInput & {
  orderId: string
  data: Omit<MappaInput, 'action'>
}

type UpdateIsMappaInput = AuthenticatedRequestInput & {
  orderId: string
  data: Omit<IsMappaInput, 'action'>
}

export default class MappaService {
  constructor(private readonly apiClient: RestClient) {}

  async updateMappa(input: UpdateMappaInput): Promise<Mappa | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/mappa`,
        data: input.data,
        token: input.accessToken,
      })
      return MappaModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }

  async updateIsMappa(input: UpdateIsMappaInput): Promise<Mappa | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/is-mappa`,
        data: input.data,
        token: input.accessToken,
      })
      return MappaModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
