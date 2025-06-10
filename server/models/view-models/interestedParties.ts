import { createGovukErrorSummary } from '../../utils/errors'
import FeatureFlags from '../../utils/featureFlags'
import { getError } from '../../utils/utils'
import { InterestedPartiesFormData } from '../form-data/interestedParties'
import { InterestedParties } from '../InterestedParties'
import { NotifyingOrganisation } from '../NotifyingOrganisation'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type InterestedPartiesViewModel = ViewModel<NonNullable<InterestedParties>> & {
  DDv5: boolean
}

const getResponsibleOrgansiationRegion = (formData: InterestedPartiesFormData) => {
  if (formData.responsibleOrganisation === 'PROBATION') {
    return formData.responsibleOrgProbationRegion
  }

  if (formData.responsibleOrganisation === 'YJS') {
    return formData.yjsRegion
  }

  return ''
}

const getNotifyingOrganisationName = (formData: InterestedPartiesFormData) => {
  const lookup: Partial<Record<Exclude<NotifyingOrganisation, null>, string>> = {
    CROWN_COURT: formData.crownCourt,
    FAMILY_COURT: formData.familyCourt,
    MAGISTRATES_COURT: formData.magistratesCourt,
    MILITARY_COURT: formData.militaryCourt,
    PRISON: formData.prison,
    PROBATION: formData.notifyingOrgProbationRegion,
  }

  if (formData.notifyingOrganisation && formData.notifyingOrganisation in lookup) {
    return lookup[formData.notifyingOrganisation] as Exclude<NotifyingOrganisation, null>
  }

  return ''
}

const constructFromFormData = (
  formData: InterestedPartiesFormData,
  validationErrors: ValidationResult,
): InterestedPartiesViewModel => {
  return {
    notifyingOrganisation: {
      value: formData.notifyingOrganisation || '',
      error: getError(validationErrors, 'notifyingOrganisation'),
    },
    notifyingOrganisationName: {
      value: getNotifyingOrganisationName(formData),
      error: getError(validationErrors, 'notifyingOrganisationName'),
    },
    notifyingOrganisationEmail: {
      value: formData.notifyingOrganisationEmail,
      error: getError(validationErrors, 'notifyingOrganisationEmail'),
    },
    responsibleOfficerName: {
      value: formData.responsibleOfficerName || '',
      error: getError(validationErrors, 'responsibleOfficerName'),
    },
    responsibleOfficerPhoneNumber: {
      value: formData.responsibleOfficerPhoneNumber || '',
      error: getError(validationErrors, 'responsibleOfficerPhoneNumber'),
    },
    responsibleOrganisation: {
      value: formData.responsibleOrganisation || '',
      error: getError(validationErrors, 'responsibleOrganisation'),
    },
    responsibleOrganisationRegion: {
      value: getResponsibleOrgansiationRegion(formData),
      error: getError(validationErrors, 'responsibleOrganisationRegion'),
    },
    responsibleOrganisationEmail: {
      value: formData.responsibleOrganisationEmail,
      error: getError(validationErrors, 'responsibleOrganisationEmail'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    DDv5: FeatureFlags.getInstance().get('DD_V5_1_ENABLED'),
  }
}

const constructFromEntity = (interestedParties: InterestedParties | null): InterestedPartiesViewModel => {
  return {
    notifyingOrganisation: {
      value: interestedParties?.notifyingOrganisation ?? '',
    },
    notifyingOrganisationName: {
      value: interestedParties?.notifyingOrganisationName ?? '',
    },
    notifyingOrganisationEmail: {
      value: interestedParties?.notifyingOrganisationEmail ?? '',
    },
    responsibleOfficerName: {
      value: interestedParties?.responsibleOfficerName ?? '',
    },
    responsibleOfficerPhoneNumber: {
      value: interestedParties?.responsibleOfficerPhoneNumber ?? '',
    },
    responsibleOrganisation: {
      value: interestedParties?.responsibleOrganisation ?? '',
    },
    responsibleOrganisationRegion: {
      value: interestedParties?.responsibleOrganisationRegion ?? '',
    },
    responsibleOrganisationEmail: {
      value: interestedParties?.responsibleOrganisationEmail ?? '',
    },
    errorSummary: null,
    DDv5: FeatureFlags.getInstance().get('DD_V5_1_ENABLED'),
  }
}

const construct = (
  interestedParties: InterestedParties | null,
  formData: InterestedPartiesFormData,
  validationErrors: ValidationResult,
): InterestedPartiesViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors)
  }

  return constructFromEntity(interestedParties)
}

export default {
  construct,
}
