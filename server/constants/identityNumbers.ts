import { IdentityNumberType } from '../models/DeviceWearer'
import { NotifyingOrganisation } from '../models/NotifyingOrganisation'
import { Cohort } from '../models/UserCohort'

export type IdentityNumberFieldName =
  | 'pncId'
  | 'nomisId'
  | 'deliusId'
  | 'prisonNumber'
  | 'complianceAndEnforcementPersonReference'
  | 'courtCaseReferenceNumber'

export const identityNumberFieldNames: Record<IdentityNumberType, IdentityNumberFieldName> = {
  PNC: 'pncId',
  NOMIS: 'nomisId',
  DELIUS: 'deliusId',
  PRISON_NUMBER: 'prisonNumber',
  COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE: 'complianceAndEnforcementPersonReference',
  COURT_CASE_REFERENCE_NUMBER: 'courtCaseReferenceNumber',
}

export const identityNumbersByNotifyingOrganisation: Record<NotifyingOrganisation, IdentityNumberType[]> = {
  PROBATION: ['NOMIS', 'DELIUS'],
  PRISON: ['NOMIS'],
  YOUTH_CUSTODY_SERVICE: ['PNC', 'NOMIS'],
  HOME_OFFICE: ['COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE'],
  CIVIL_COUNTY_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  CROWN_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  FAMILY_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  MAGISTRATES_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  MILITARY_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  SCOTTISH_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
  YOUTH_COURT: ['COURT_CASE_REFERENCE_NUMBER'],
}

export const allIdentityNumbers: IdentityNumberType[] = [
  'NOMIS',
  'DELIUS',
  'PNC',
  'COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE',
  'COURT_CASE_REFERENCE_NUMBER',
]

export const identityNumbersByCohort: Partial<Record<Cohort, IdentityNumberType[]>> = {
  PROBATION: ['NOMIS', 'DELIUS'],
  HOME_OFFICE: ['COMPLIANCE_AND_ENFORCEMENT_PERSON_REFERENCE'],
  COURT: ['COURT_CASE_REFERENCE_NUMBER'],
}

export const identityNumbersByCohortPendingOrg: Partial<Record<Cohort, IdentityNumberType[]>> = {
  PRISON: ['PNC', 'NOMIS'],
}

export const getIdentityNumbers = (
  cohort?: Cohort | null,
  notifyingOrganisation?: NotifyingOrganisation | null,
): IdentityNumberType[] => {
  const idTypeForCohort = cohort ? identityNumbersByCohort[cohort] : undefined
  if (idTypeForCohort) {
    return idTypeForCohort
  }

  if (notifyingOrganisation) {
    return identityNumbersByNotifyingOrganisation[notifyingOrganisation] ?? allIdentityNumbers
  }

  const unselectedOrg = cohort ? identityNumbersByCohortPendingOrg[cohort] : undefined

  return unselectedOrg ?? allIdentityNumbers
}
