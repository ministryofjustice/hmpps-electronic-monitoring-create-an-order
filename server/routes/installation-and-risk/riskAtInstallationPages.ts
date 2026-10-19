import paths from '../../constants/paths'
import { ValidationResult } from '../../models/Validation'
import { convertZodErrorToValidationError } from '../../utils/errors'
import { OtherRisksFormValidator } from './other-risks/formModel'
import { RiskAtAddressFormValidator } from './risk-at-address/formModel'
import { RiskBehaviourFormValidator } from './risk-behaviour/formModel'
import { RiskAtInstallation } from './riskAtInstallationModel'

export type RiskAtInstallationPage = { path: string; errors: ValidationResult }

const PAGES = [
  {
    path: paths.INSTALLATION_AND_RISK.RISK_BEHAVIOUR,
    fields: ['possibleRisk', 'genderRiskDetails'],
    validator: RiskBehaviourFormValidator,
  },
  {
    path: paths.INSTALLATION_AND_RISK.RISK_AT_ADDRESS,
    fields: ['riskCategory'],
    validator: RiskAtAddressFormValidator,
  },
  {
    path: paths.INSTALLATION_AND_RISK.OTHER_RISKS,
    fields: ['hasOtherRisks', 'riskDetails'],
    validator: OtherRisksFormValidator,
  },
]

export const pageForErrors = (errors: ValidationResult, orderId: string): RiskAtInstallationPage | null => {
  const page = PAGES.find(({ fields }) => errors.some(({ field }) => fields.includes(field)))
  if (!page) return null

  return {
    path: page.path.replace(':orderId', orderId),
    errors: errors.filter(({ field }) => page.fields.includes(field)),
  }
}

export const findMissingAnswers = (answers: RiskAtInstallation): ValidationResult =>
  PAGES.flatMap(({ validator }) => {
    const result = validator.safeParse(answers)
    return result.success ? [] : convertZodErrorToValidationError(result.error)
  })

export const firstUnansweredPage = (answers: RiskAtInstallation, orderId: string): string | null =>
  pageForErrors(findMissingAnswers(answers), orderId)?.path ?? null
