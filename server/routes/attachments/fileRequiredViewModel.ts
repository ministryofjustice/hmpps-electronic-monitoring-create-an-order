import { ErrorMessage } from '../../models/view-models/utils'
import { Question } from '../../types/i18n/pages/questionPage'
import { ErrorSummary } from '../../utils/views/govukFrontEndTypes/errorSummary'

type FileRequiredViewModel = {
  title?: string
  heading?: string
  question: Partial<Question>
  fileRequired: {
    value?: string | undefined | null
    error?: ErrorMessage
  }
  errorSummary: ErrorSummary | null
}

export default FileRequiredViewModel
