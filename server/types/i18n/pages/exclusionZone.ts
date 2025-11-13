import QuestionPageContent from './questionPage'

type ExclusionZonePageContent = QuestionPageContent<
  'anotherZone' | 'description' | 'duration' | 'endDate' | 'name' | 'file' | 'startDate'
>

export default ExclusionZonePageContent
