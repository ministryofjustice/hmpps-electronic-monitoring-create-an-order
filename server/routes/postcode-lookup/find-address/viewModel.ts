import I18n from '../../../types/i18n'
import QuestionPageContent from '../../../types/i18n/pages/questionPage'

type FindAddressViewModel = { content: QuestionPageContent<'postcode' | 'buildingId'> }

const construct = (content: I18n): FindAddressViewModel => {
  return {
    content: content.pages.deviceWearerAddress,
  }
}

export default { construct }
