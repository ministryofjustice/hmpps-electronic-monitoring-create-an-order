import { OrderCohort, getOrderCohort } from '../models/OrderCohort'

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

export type RiskInformationFlow = {
  pages: readonly RiskInformationPage[]
}

export const defaultRiskInformationPages: readonly RiskInformationPage[] = [
  riskInformationPages.detailsOfInstallation,
  riskInformationPages.isMappa,
  riskInformationPages.mappa,
  riskInformationPages.offence,
  riskInformationPages.offenceOtherInfo,
  riskInformationPages.dapo,
  riskInformationPages.checkAnswers,
]

type RiskInformationProfile = {
  excludedPages: readonly RiskInformationPage[]
}

const riskInformationProfiles: Record<OrderCohort, RiskInformationProfile> = {
  STANDARD: {
    excludedPages: [riskInformationPages.dapo, riskInformationPages.isMappa, riskInformationPages.mappa],
  },
  FAMILY_COURT: {
    excludedPages: [
      riskInformationPages.offence,
      riskInformationPages.offenceOtherInfo,
      riskInformationPages.dapo,
      riskInformationPages.isMappa,
      riskInformationPages.mappa,
    ],
  },
  COURT: {
    excludedPages: [
      riskInformationPages.offence,
      riskInformationPages.offenceOtherInfo,
      riskInformationPages.dapo,
      riskInformationPages.isMappa,
      riskInformationPages.mappa,
    ],
  },
  HOME_OFFICE: {
    excludedPages: [riskInformationPages.offence, riskInformationPages.offenceOtherInfo, riskInformationPages.dapo],
  },
} as const satisfies Record<string, RiskInformationProfile>

export const getRiskInformationFlow = (
  notifyingOrganisation: Parameters<typeof getOrderCohort>[0],
): RiskInformationFlow => {
  const profile = riskInformationProfiles[getOrderCohort(notifyingOrganisation)]
  const excludedPages = new Set<RiskInformationPage>(profile.excludedPages)

  return {
    pages: defaultRiskInformationPages.filter(page => !excludedPages.has(page)),
  }
}
