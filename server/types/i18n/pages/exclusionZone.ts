import QuestionPageContent from './questionPage'

type ExclusionZonePageContent = QuestionPageContent<
  'anotherZone' | 'description' | 'duration' | 'endDate' | 'file' | 'startDate'
>

export default ExclusionZonePageContent
