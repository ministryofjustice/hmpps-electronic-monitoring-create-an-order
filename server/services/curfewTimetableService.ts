import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import CurfewTimetableModel, { CurfewTimetable } from '../models/CurfewTimetable'
import { ListValidationResult, ListValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type CurfewTimetableInput = AuthenticatedRequestInput & {
  orderId: string
  data: CurfewTimetable
}

export default class CurfewTimetableService {
  constructor(private readonly apiClient: RestClient) {}

  async update(input: CurfewTimetableInput): Promise<CurfewTimetable | ListValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/monitoring-conditions-curfew-timetable`,
        data: input.data,
        token: input.accessToken,
      })
      return CurfewTimetableModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return ListValidationResultModel.parse(sanitisedError.data)
      }

      throw e
    }
  }
}
