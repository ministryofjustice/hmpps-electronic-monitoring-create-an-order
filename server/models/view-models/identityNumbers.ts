import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { DeviceWearer, IdentityNumberType } from '../DeviceWearer'
import { IdentityNumbersFormData } from '../form-data/deviceWearer'
import { ValidationResult } from '../Validation'
import { ViewModel } from './utils'

type DeviceWearerViewModel = ViewModel<
  Pick<
    DeviceWearer,
    | 'nomisId'
    | 'deliusId'
    | 'pncId'
    | 'prisonNumber'
    | 'homeOfficeReferenceNumber'
    | 'complianceAndEnforcementPersonReference'
    | 'courtCaseReferenceNumber'
  >
> & {
  identityNumbers: {
    values: IdentityNumberType[]
    error?: { text: string }
  }
}

const constructFromFormData = (
  formData: IdentityNumbersFormData,
  validationErrors: ValidationResult,
): DeviceWearerViewModel => {
  return {
    identityNumbers: {
      values: formData.identityNumbers,
      error: getError(validationErrors, 'identityNumbers'),
    },
    nomisId: {
      value: formData.nomisId || '',
      error: getError(validationErrors, 'nomisId'),
    },
    deliusId: {
      value: formData.deliusId || '',
      error: getError(validationErrors, 'deliusId'),
    },
    pncId: {
      value: formData.pncId || '',
      error: getError(validationErrors, 'pncId'),
    },
    prisonNumber: {
      value: formData.prisonNumber || '',
      error: getError(validationErrors, 'prisonNumber'),
    },
    homeOfficeReferenceNumber: {
      value: formData.homeOfficeReferenceNumber || '',
      error: getError(validationErrors, 'homeOfficeReferenceNumber'),
    },
    complianceAndEnforcementPersonReference: {
      value: formData.complianceAndEnforcementPersonReference || '',
      error: getError(validationErrors, 'complianceAndEnforcementPersonReference'),
    },
    courtCaseReferenceNumber: {
      value: formData.courtCaseReferenceNumber || '',
      error: getError(validationErrors, 'courtCaseReferenceNumber'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
  }
}

const createFromEntity = (deviceWearer: DeviceWearer): DeviceWearerViewModel => {
  const identityNumbers: IdentityNumberType[] = []

  if (deviceWearer.nomisId) identityNumbers.push('NOMIS')
  if (deviceWearer.pncId) identityNumbers.push('PNC')
  if (deviceWearer.deliusId) identityNumbers.push('DELIUS')
  if (deviceWearer.prisonNumber) identityNumbers.push('PRISON_NUMBER')
  if (deviceWearer.homeOfficeReferenceNumber) identityNumbers.push('HOME_OFFICE')
  if (deviceWearer.complianceAndEnforcementPersonReference) {
    identityNumbers.push('COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE')
  }
  if (deviceWearer.courtCaseReferenceNumber) {
    identityNumbers.push('COURT_CASE_REFERENCE_NUMBER')
  }

  return {
    identityNumbers: {
      values: identityNumbers,
    },
    nomisId: { value: deviceWearer.nomisId || '' },
    deliusId: { value: deviceWearer.deliusId || '' },
    pncId: { value: deviceWearer.pncId || '' },
    prisonNumber: { value: deviceWearer.prisonNumber || '' },
    homeOfficeReferenceNumber: { value: deviceWearer.homeOfficeReferenceNumber || '' },
    complianceAndEnforcementPersonReference: {
      value: deviceWearer.complianceAndEnforcementPersonReference || '',
    },
    courtCaseReferenceNumber: { value: deviceWearer.courtCaseReferenceNumber || '' },
    errorSummary: null,
  }
}

const construct = (
  deviceWearer: DeviceWearer,
  formData: IdentityNumbersFormData,
  errors: ValidationResult,
): DeviceWearerViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(deviceWearer)
}

export default {
  construct,
}
