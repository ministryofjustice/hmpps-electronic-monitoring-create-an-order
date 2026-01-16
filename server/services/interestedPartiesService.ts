import RestClient from '../data/restClient'
import { AuthenticatedRequestInput } from '../interfaces/request'
import { InterestedPartiesFormData } from '../models/form-data/interestedParties'
import InterestedPartiesModel, { InterestedParties } from '../models/InterestedParties'
import { NotifyingOrganisation } from '../models/NotifyingOrganisation'
import { ValidationResult } from '../models/Validation'
import { SanitisedError } from '../sanitisedError'
import { convertBackendErrorToValidationError } from '../utils/errors'

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

  private getResponsibleOrgansiationRegion(data: InterestedPartiesFormData) {
    if (data.responsibleOrganisation === 'PROBATION') {
      return data.responsibleOrgProbationRegion
    }

    if (data.responsibleOrganisation === 'POLICE') {
      return data.policeArea
    }

    if (data.responsibleOrganisation === 'YJS') {
      return data.yjsRegion
    }

    return ''
  }

  private getNotifyingOrganisationName(data: InterestedPartiesFormData) {
    const lookup: Partial<Record<Exclude<NotifyingOrganisation, null>, string>> = {
      CIVIL_COUNTY_COURT: data.civilCountyCourt,
      CROWN_COURT: data.crownCourt,
      FAMILY_COURT: data.familyCourt,
      MAGISTRATES_COURT: data.magistratesCourt,
      MILITARY_COURT: data.militaryCourt,
      PRISON: data.prison,
      YOUTH_COURT: data.youthCourt,
      YOUTH_CUSTODY_SERVICE: data.youthCustodyServiceRegion,
    }

    if (data.notifyingOrganisation && data.notifyingOrganisation in lookup) {
      return lookup[data.notifyingOrganisation] as Exclude<NotifyingOrganisation, null>
    }

    return ''
  }

  private getRequestBody(data: InterestedPartiesFormData) {
    return {
      notifyingOrganisation: data.notifyingOrganisation,
      notifyingOrganisationName: this.getNotifyingOrganisationName(data),
      notifyingOrganisationEmail: data.notifyingOrganisationEmail,
      responsibleOfficerName: data.responsibleOfficerName,
      responsibleOfficerPhoneNumber: this.getResponsibleOfficerPhoneNumber(data),
      responsibleOrganisation: data.responsibleOrganisation,
      responsibleOrganisationRegion: this.getResponsibleOrgansiationRegion(data),
      responsibleOrganisationEmail: data.responsibleOrganisationEmail,
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
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
