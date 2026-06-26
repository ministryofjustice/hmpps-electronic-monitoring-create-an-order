import { z } from 'zod'

const DetailsOfInstallationModel = z.object({
  riskCategory: z.array(z.string()).nullable(),
  genderRiskDetails: z.string().nullable().optional(),
  riskDetails: z.string().nullable(),
})

export type DetailsOfInstallation = z.infer<typeof DetailsOfInstallationModel>

const GENDER_RISK_TEXT = 'Risk to gender: '
const ADDITIONAL_DETAILS_TEXT = ' Additional risk details: '

export const mergeRiskDetails = (riskDetails: string, genderRiskDetails?: string | null): string =>
  genderRiskDetails?.trim()
    ? `${GENDER_RISK_TEXT}${genderRiskDetails}${ADDITIONAL_DETAILS_TEXT}${riskDetails}`
    : riskDetails

export const splitRiskDetails = (riskDetails?: string | null): { riskDetails: string; genderRiskDetails: string } => {
  const value = riskDetails ?? ''
  const separatorIndex = value.startsWith(GENDER_RISK_TEXT) ? value.indexOf(ADDITIONAL_DETAILS_TEXT) : -1

  if (separatorIndex === -1) {
    return { genderRiskDetails: '', riskDetails: value }
  }

  return {
    genderRiskDetails: value.slice(GENDER_RISK_TEXT.length, separatorIndex),
    riskDetails: value.slice(separatorIndex + ADDITIONAL_DETAILS_TEXT.length),
  }
}

export default DetailsOfInstallationModel
