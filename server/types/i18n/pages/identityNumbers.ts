import QuestionPageContent from './questionPage'

type IdentityNumbersPageContent = QuestionPageContent<
  | 'deliusId'
  | 'nomisId'
  | 'pncId'
  | 'prisonNumber'
  | 'complianceAndEnforcementPersonReference'
  | 'courtCaseReferenceNumber'
>

export default IdentityNumbersPageContent
