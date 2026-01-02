import QuestionPageContent from './questionPage'

type IdentityNumbersPageContent = QuestionPageContent<
  | 'pncId'
  | 'nomisId'
  | 'prisonNumber'
  | 'deliusId'
  | 'complianceAndEnforcementPersonReference'
  | 'courtCaseReferenceNumber'
>

export default IdentityNumbersPageContent
