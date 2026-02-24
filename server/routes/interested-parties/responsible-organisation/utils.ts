import { ResponsibleOrganisationInput } from './formModel'

export const getResponsibleOrganisationRegion = (data: Partial<ResponsibleOrganisationInput>): string => {
  if (!data.responsibleOrganisation) return ''

  const lookup: Record<string, string | undefined> = {
    PROBATION: data.responsibleOrgProbationRegion,
    POLICE: data.policeArea,
    YJS: data.yjsRegion,
  }

  return lookup[data.responsibleOrganisation] || ''
}

export default { getResponsibleOrganisationRegion }
