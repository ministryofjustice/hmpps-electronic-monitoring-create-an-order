import { NotifyingOrganisation } from '../models/NotifyingOrganisation'

export const riskInformationPages = {
  offence: 'OFFENCE',
  offenceOtherInfo: 'OFFENCE_OTHER_INFO',
  dapo: 'DAPO',
  detailsOfInstallation: 'DETAILS_OF_INSTALLATION',
  isMappa: 'IS_MAPPA',
  mappa: 'MAPPA',
  checkAnswers: 'CHECK_ANSWERS_INSTALLATION_AND_RISK',
} as const

export type RiskInformationPage = (typeof riskInformationPages)[keyof typeof riskInformationPages]

export type OffencePolicy = { mode: 'USER_ENTERED' } | { mode: 'NONE' }

export type RiskInformationFlow = {
  pages: readonly RiskInformationPage[]
  offence: OffencePolicy
}

export const defaultRiskInformationPages: readonly RiskInformationPage[] = [
  riskInformationPages.offence,
  riskInformationPages.offenceOtherInfo,
  riskInformationPages.dapo,
  riskInformationPages.detailsOfInstallation,
  riskInformationPages.isMappa,
  riskInformationPages.mappa,
  riskInformationPages.checkAnswers,
]

type RiskInformationProfile = {
  excludedPages: readonly RiskInformationPage[]
  offence: OffencePolicy
}

const riskInformationProfiles = {
  standard: {
    excludedPages: [riskInformationPages.dapo, riskInformationPages.isMappa, riskInformationPages.mappa],
    offence: { mode: 'USER_ENTERED' },
  },
  familyCourt: {
    excludedPages: [
      riskInformationPages.offence,
      riskInformationPages.offenceOtherInfo,
      riskInformationPages.dapo,
      riskInformationPages.isMappa,
      riskInformationPages.mappa,
    ],
    offence: { mode: 'NONE' },
  },
  court: {
    excludedPages: [
      riskInformationPages.offence,
      riskInformationPages.offenceOtherInfo,
      riskInformationPages.dapo,
      riskInformationPages.isMappa,
      riskInformationPages.mappa,
    ],
    offence: { mode: 'NONE' },
  },
  homeOffice: {
    excludedPages: [riskInformationPages.offence, riskInformationPages.offenceOtherInfo, riskInformationPages.dapo],
    offence: { mode: 'NONE' },
  },
} as const satisfies Record<string, RiskInformationProfile>

type RiskInformationProfileName = keyof typeof riskInformationProfiles

export const notifyingOrganisationRiskProfiles: Record<NotifyingOrganisation, RiskInformationProfileName> = {
  HOME_OFFICE: 'homeOffice',
  PRISON: 'standard',
  PROBATION: 'standard',
  YOUTH_CUSTODY_SERVICE: 'standard',
  CIVIL_COUNTY_COURT: 'court',
  CROWN_COURT: 'court',
  FAMILY_COURT: 'familyCourt',
  MAGISTRATES_COURT: 'court',
  MILITARY_COURT: 'court',
  SCOTTISH_COURT: 'court',
  YOUTH_COURT: 'court',
}

export const getRiskInformationFlow = (
  notifyingOrganisation: NotifyingOrganisation | null | undefined,
): RiskInformationFlow => {
  const profileName = notifyingOrganisation ? notifyingOrganisationRiskProfiles[notifyingOrganisation] : 'standard'
  const profile = riskInformationProfiles[profileName]
  const excludedPages = new Set<RiskInformationPage>(profile.excludedPages)

  return {
    pages: defaultRiskInformationPages.filter(page => !excludedPages.has(page)),
    offence: profile.offence,
  }
}
