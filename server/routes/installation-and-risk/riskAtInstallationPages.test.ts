import paths from '../../constants/paths'
import { RiskAtInstallation } from './riskAtInstallationModel'
import { findMissingAnswers, firstUnansweredPage, pageForErrors } from './riskAtInstallationPages'

describe('riskAtInstallationPages', () => {
  const orderId = 'order-id'
  const { RISK_BEHAVIOUR, RISK_AT_ADDRESS, OTHER_RISKS } = paths.INSTALLATION_AND_RISK
  const pathFor = (path: string) => path.replace(':orderId', orderId)
  const errorOn = (field: string) => ({ field, error: `${field} error` })
  const complete: RiskAtInstallation = {
    possibleRisk: ['SEXUAL_OFFENCES'],
    riskCategory: ['DANGEROUS_ANIMALS'],
    riskDetails: '',
    hasOtherRisks: 'NO',
    genderRiskDetails: '',
  }
  const unanswered: RiskAtInstallation = {
    possibleRisk: [],
    riskCategory: [],
    riskDetails: '',
    hasOtherRisks: null,
    genderRiskDetails: '',
  }
  const fieldsOf = (missing: { field: string }[]) => missing.map(({ field }) => field)

  describe('findMissingAnswers', () => {
    it('finds nothing missing when every question is answered', () => {
      expect(findMissingAnswers(complete)).toEqual([])
    })

    it('finds every unanswered question', () => {
      expect(fieldsOf(findMissingAnswers(unanswered))).toEqual(['possibleRisk', 'riskCategory', 'hasOtherRisks'])
    })

    it('finds the missing gender risk details', () => {
      const answers = { ...complete, possibleRisk: ['RISK_TO_GENDER'] }

      expect(fieldsOf(findMissingAnswers(answers))).toEqual(['genderRiskDetails'])
    })

    it('finds the missing other risk details', () => {
      const answers: RiskAtInstallation = { ...complete, hasOtherRisks: 'YES' }

      expect(fieldsOf(findMissingAnswers(answers))).toEqual(['riskDetails'])
    })
  })

  describe('firstUnansweredPage', () => {
    it('has no unanswered page when every question is answered', () => {
      expect(firstUnansweredPage(complete, orderId)).toBeNull()
    })

    it('goes to the earliest page with unanswered questions', () => {
      const answers: RiskAtInstallation = { ...complete, riskCategory: [], hasOtherRisks: null }

      expect(firstUnansweredPage(answers, orderId)).toBe(pathFor(RISK_AT_ADDRESS))
    })
  })

  describe('pageForErrors', () => {
    it.each([
      ['possibleRisk', RISK_BEHAVIOUR],
      ['genderRiskDetails', RISK_BEHAVIOUR],
      ['riskCategory', RISK_AT_ADDRESS],
      ['hasOtherRisks', OTHER_RISKS],
      ['riskDetails', OTHER_RISKS],
    ])('goes to the page that asks for %s', (field, page) => {
      expect(pageForErrors([errorOn(field)], orderId)?.path).toBe(pathFor(page))
    })

    it('goes to the earliest page with errors, showing only its errors', () => {
      const errors = [errorOn('riskDetails'), errorOn('riskCategory')]

      expect(pageForErrors(errors, orderId)).toEqual({
        path: pathFor(RISK_AT_ADDRESS),
        errors: [errorOn('riskCategory')],
      })
    })

    it('has no page for errors on fields it does not know', () => {
      expect(pageForErrors([errorOn('unknown')], orderId)).toBeNull()
    })
  })
})
