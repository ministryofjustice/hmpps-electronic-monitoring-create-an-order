import { IdentityNumberFieldName } from '../../../constants/identityNumbers'
import QuestionPageContent from './questionPage'

type IdentityNumbersPageContent = QuestionPageContent<IdentityNumberFieldName> & {
  inputLabels: Record<IdentityNumberFieldName, string>
  singleQuestionTitles: Record<IdentityNumberFieldName, string>
}

export default IdentityNumbersPageContent
