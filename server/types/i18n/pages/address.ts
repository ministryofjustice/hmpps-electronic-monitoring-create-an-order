import QuestionPageContent from './questionPage'

type AddressPageContent = QuestionPageContent<
  'hasAnotherAddress' | 'addressLine1' | 'addressLine2' | 'addressLine3' | 'addressLine4' | 'postcode'
>

export default AddressPageContent
