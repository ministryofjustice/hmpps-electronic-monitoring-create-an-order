import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import MappaModel, { Mappa } from '../../../models/MappaModel'
import { ValidationResult } from '../../../models/Validation'
import { SanitisedError } from '../../../sanitisedError'
import { convertBackendErrorToValidationError } from '../../../utils/errors'
import { MappaInput } from './formModel'

type UpdateMappaInput = AuthenticatedRequestInput & {
  orderId: string
  data: Omit<MappaInput, 'action'>
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
}
