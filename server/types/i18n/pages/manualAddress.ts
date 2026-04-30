import QuestionPageContent from './questionPage'

type ManualAddressPageContent = QuestionPageContent<
  'addressLine1' | 'addressLine2' | 'addressLine3' | 'addressLine4' | 'postcode'
>

export default ManualAddressPageContent
