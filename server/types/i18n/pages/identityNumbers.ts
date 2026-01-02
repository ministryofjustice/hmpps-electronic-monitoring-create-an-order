import QuestionPageContent from './questionPage'

type IdentityNumbersPageContent = QuestionPageContent<
  | 'deliusId'
  | 'homeOfficeReferenceNumber'
  | 'nomisId'
  | 'pncId'
  | 'prisonNumber'
  | 'complianceAndEnforcementPersonReference'
  | 'courtCaseReferenceNumber'
>

export default IdentityNumbersPageContent
