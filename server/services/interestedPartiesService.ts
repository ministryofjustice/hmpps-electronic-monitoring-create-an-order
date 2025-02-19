import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { InterestedPartiesFormData } from '../models/form-data/interestedParties'
import InterestedPartiesModel, { InterestedParties } from '../models/InterestedParties'
import { ValidationResult, ValidationResultModel } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'

type UpdateInterestedPartiesRequest = AuthenticatedRequestInput & {
  orderId: string
  data: InterestedPartiesFormData
}

export default class InterestedPartiesService {
  constructor(private readonly apiClient: RestClient) {}

  private getResponsibleOrgansiationRegion(data: InterestedPartiesFormData) {
    if (data.responsibleOrganisation === 'PROBATION') {
      return data.probationRegion
    }

    if (data.responsibleOrganisation === 'YJS') {
      return data.yjsRegion
    }

    return ''
  }

  async update(input: UpdateInterestedPartiesRequest): Promise<InterestedParties | ValidationResult> {
    const request = {
      notifyingOrganisation: input.data.notifyingOrganisation,
      notifyingOrganisationName: input.data.notifyingOrganisationName,
      notifyingOrganisationEmail: input.data.notifyingOrganisationEmail,
      responsibleOfficerName: input.data.responsibleOfficerName,
      responsibleOfficerPhoneNumber: input.data.responsibleOfficerPhoneNumber,
      responsibleOrganisation: input.data.responsibleOrganisation,
      responsibleOrganisationRegion: this.getResponsibleOrgansiationRegion(input.data),
      responsibleOrganisationAddressLine1: input.data.responsibleOrganisationAddressLine1,
      responsibleOrganisationAddressLine2: input.data.responsibleOrganisationAddressLine2,
      responsibleOrganisationAddressLine3: input.data.responsibleOrganisationAddressLine3,
      responsibleOrganisationAddressLine4: input.data.responsibleOrganisationAddressLine4,
      responsibleOrganisationAddressPostcode: input.data.responsibleOrganisationAddressPostcode,
      responsibleOrganisationPhoneNumber: input.data.responsibleOrganisationPhoneNumber,
      responsibleOrganisationEmail: input.data.responsibleOrganisationEmail,
    }

    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/interested-parties`,
        data: request,
        token: input.accessToken,
      })
      return InterestedPartiesModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError

      if (sanitisedError.status === 400) {
        return ValidationResultModel.parse((e as SanitisedError).data)
      }

      throw e
    }
  }
}
