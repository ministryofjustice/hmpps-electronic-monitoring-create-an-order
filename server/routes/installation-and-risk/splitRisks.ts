import { DataDictionaryVersion } from '../../models/Order'
import { getRiskCategoryCodes, POSSIBLE_RISK_CODES } from './riskCodes'

const splitRisks = (codes: readonly string[] | null | undefined, version: DataDictionaryVersion) => {
  const risks = codes ?? []
  const possibleRiskCodes: readonly string[] = POSSIBLE_RISK_CODES
  const riskCategoryCodes = getRiskCategoryCodes(version)

  return {
    possibleRisk: risks.filter(risk => possibleRiskCodes.includes(risk)),
    riskCategory: risks.filter(risk => riskCategoryCodes.includes(risk)),
  }
}

export default splitRisks
