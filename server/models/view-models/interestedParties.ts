import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'
import { createSortedGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { InterestedPartiesFormData } from '../form-data/interestedParties'
import { InterestedParties } from '../InterestedParties'
import { NotifyingOrganisation } from '../NotifyingOrganisation'
import { Order } from '../Order'
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
    PROBATION: 'Probation Board',
    YOUTH_COURT: formData.youthCourt,
    YOUTH_CUSTODY_SERVICE: '',
  }

  if (formData.notifyingOrganisation && formData.notifyingOrganisation in lookup) {
    return lookup[formData.notifyingOrganisation] as Exclude<NotifyingOrganisation, null>
  }

  return ''
}

const fieldNames = {
  notifyingOrganisation: 'notifyingOrganisation',
  notifyingOrganisationName: 'notifyingOrganisationName',
  notifyingOrganisationEmail: 'notifyingOrganisationEmail',
  reponsibleOfficerName: 'responsibleOfficerName',
  responsibleOfficerPhoneNumber: 'responsibleOfficerPhoneNumber',
  responsibleOrganisation: 'responsibleOrganisation',
  responsibleOrganisationRegion: 'responsibleOrganisationRegion',
  responsibleOrganisationEmail: 'responsibleOrganisationEmail',
} as const

const constructFromFormData = (
  formData: InterestedPartiesFormData,
  validationErrors: ValidationResult,
  order: Order,
): InterestedPartiesViewModel => {
  return {
    notifyingOrganisation: {
      value: formData.notifyingOrganisation || '',
      error: getError(validationErrors, fieldNames.notifyingOrganisation),
    },
    notifyingOrganisationName: {
      value: getNotifyingOrganisationName(formData),
      error: getError(validationErrors, fieldNames.notifyingOrganisationName),
    },
    notifyingOrganisationEmail: {
      value: formData.notifyingOrganisationEmail,
      error: getError(validationErrors, fieldNames.notifyingOrganisationEmail),
    },
    responsibleOfficerName: {
      value: formData.responsibleOfficerName || '',
      error: getError(validationErrors, fieldNames.reponsibleOfficerName),
    },
    responsibleOfficerPhoneNumber: {
      value: formData.responsibleOfficerPhoneNumber || '',
      error: getError(validationErrors, fieldNames.responsibleOfficerPhoneNumber),
    },
    responsibleOrganisation: {
      value: formData.responsibleOrganisation || '',
      error: getError(validationErrors, fieldNames.responsibleOrganisation),
    },
    responsibleOrganisationRegion: {
      value: getResponsibleOrgansiationRegion(formData),
      error: getError(validationErrors, fieldNames.responsibleOrganisationRegion),
    },
    responsibleOrganisationEmail: {
      value: formData.responsibleOrganisationEmail,
      error: getError(validationErrors, fieldNames.responsibleOrganisationEmail),
    },
    errorSummary: createSortedGovukErrorSummary(validationErrors, Object.values(fieldNames)),
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const constructFromEntity = (order: Order): InterestedPartiesViewModel => {
  const { interestedParties } = order
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
    DDv5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const construct = (
  order: Order,
  formData: InterestedPartiesFormData,
  validationErrors: ValidationResult,
): InterestedPartiesViewModel => {
  if (validationErrors.length > 0) {
    return constructFromFormData(formData, validationErrors, order)
  }

  return constructFromEntity(order)
}

export default {
  construct,
}
