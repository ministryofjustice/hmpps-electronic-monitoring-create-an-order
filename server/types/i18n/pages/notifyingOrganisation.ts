import QuestionPageContent from './questionPage'

type NotifyingOrganisationPageContent = QuestionPageContent<
  | 'prison'
  | 'civilCountyCourt'
  | 'crownCourt'
  | 'familyCourt'
  | 'notifyingOrganisation'
  | 'magistratesCourt'
  | 'militaryCourt'
  | 'notifyingOrganisationEmail'
>

export default NotifyingOrganisationPageContent
