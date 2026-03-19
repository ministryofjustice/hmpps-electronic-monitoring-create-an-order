import QuestionPageContent from './questionPage'

type PostcodeLookupPageContent = QuestionPageContent<'postcode' | 'buildingId'>

export type AddressResultPageContent = Omit<QuestionPageContent<''>, 'questions'>

export default PostcodeLookupPageContent
