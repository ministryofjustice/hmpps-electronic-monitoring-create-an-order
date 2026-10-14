import I18n from '../../types/i18n'

const splitRisks = (codes: readonly string[] | null | undefined, reference: I18n['reference']) => {
  const risks = codes ?? []

  return {
    possibleRisk: risks.filter(risk => risk in reference.possibleRisks),
    riskCategory: risks.filter(risk => risk in reference.riskCategories),
  }
}

export default splitRisks
