import { ZodError } from 'zod'
import RestClient from '../../../data/restClient'
import { AuthenticatedRequestInput } from '../../../interfaces/request'
import MappaModel, { Mappa } from '../../../models/MappaModel'
import { ValidationResult } from '../../../models/Validation'
import { SanitisedError } from '../../../sanitisedError'
import { convertBackendErrorToValidationError, convertZodErrorToValidationError } from '../../../utils/errors'
import { IsMappaFormValidator, IsMappaInput } from '../is-mappa/formModel'
import { MappaFormValidator, MappaInput } from './formModel'

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
      const validatedInput = MappaFormValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/mappa`,
        data: validatedInput,
        token: input.accessToken,
      })
      return MappaModel.parse(result)
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }

      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }

  async updateIsMappa(input: UpdateIsMappaInput): Promise<Mappa | ValidationResult> {
    try {
      const validatedInput = IsMappaFormValidator.parse(input.data)
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/is-mappa`,
        data: validatedInput,
        token: input.accessToken,
      })
      return MappaModel.parse(result)
    } catch (e) {
      if (e instanceof ZodError) {
        return convertZodErrorToValidationError(e)
      }

      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
