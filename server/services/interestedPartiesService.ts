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

  private getResponsibleOfficerPhoneNumber(data: InterestedPartiesFormData) {
    // Empty strings are not valid phone numbers in the API
    if (data.responsibleOfficerPhoneNumber === '') {
      return null
    }

    return data.responsibleOfficerPhoneNumber
  }

  private getResponsibleOrganisationPhoneNumber(data: InterestedPartiesFormData) {
    // Empty strings are not valid phone numbers in the API
    if (data.responsibleOrganisationPhoneNumber === '') {
      return null
    }

    return data.responsibleOrganisationPhoneNumber
  }

  private getResponsibleOrgansiationRegion(data: InterestedPartiesFormData) {
    if (data.responsibleOrganisation === 'PROBATION') {
      return data.probationRegion
    }

    if (data.responsibleOrganisation === 'YJS') {
      return data.yjsRegion
    }

    return ''
  }

  private getNotifyingOrganisationName(data: InterestedPartiesFormData) {
    if (data.notifyingOrganisation === 'PRISON') {
      return data.prison
    }

    if (data.notifyingOrganisation === 'CROWN_COURT') {
      return data.crownCourt
    }

    if (data.notifyingOrganisation === 'MAGISTRATES_COURT') {
      return data.magistratesCourt
    }

    return ''
  }

  private getResponsibleOfficerName(data: InterestedPartiesFormData) {
    if (data.responsibleOfficerName === '') {
      return null
    }

    return data.responsibleOfficerName
  }

  private getResponsibleOrganisationEmail(data: InterestedPartiesFormData) {
    if (data.responsibleOrganisationEmail === '') {
      return null
    }

    return data.responsibleOrganisationEmail
  }

  private getRequestBody(data: InterestedPartiesFormData) {
    return {
      notifyingOrganisation: data.notifyingOrganisation,
      notifyingOrganisationName: this.getNotifyingOrganisationName(data),
      notifyingOrganisationEmail: data.notifyingOrganisationEmail,
      responsibleOfficerName: this.getResponsibleOfficerName(data),
      responsibleOfficerPhoneNumber: this.getResponsibleOfficerPhoneNumber(data),
      responsibleOrganisation: data.responsibleOrganisation,
      responsibleOrganisationRegion: this.getResponsibleOrgansiationRegion(data),
      responsibleOrganisationAddressLine1: data.responsibleOrganisationAddressLine1,
      responsibleOrganisationAddressLine2: data.responsibleOrganisationAddressLine2,
      responsibleOrganisationAddressLine3: data.responsibleOrganisationAddressLine3,
      responsibleOrganisationAddressLine4: data.responsibleOrganisationAddressLine4,
      responsibleOrganisationAddressPostcode: data.responsibleOrganisationAddressPostcode,
      responsibleOrganisationPhoneNumber: this.getResponsibleOrganisationPhoneNumber(data),
      responsibleOrganisationEmail: this.getResponsibleOrganisationEmail(data),
    }
  }

  async update(input: UpdateInterestedPartiesRequest): Promise<InterestedParties | ValidationResult> {
    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${input.orderId}/interested-parties`,
        data: this.getRequestBody(input.data),
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
