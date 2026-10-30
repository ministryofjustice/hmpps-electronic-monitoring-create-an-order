import QuestionPageContent from './questionPage'

type DeviceWearerPageContent = QuestionPageContent<
  | 'alias'
  | 'adultAtTimeOfInstallation'
  | 'dateOfBirth'
  | 'disabilities'
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'gender'
  | 'interpreterRequired'
  | 'language'
  | 'otherDisability'
  | 'sex'
> & {
  // Heading for the separate disability and health conditions page
  disabilitiesTitle: string
  // The Language page, which asks the interpreterRequired and language questions
  languagePage: {
    title: string
    interpreterRequiredDontKnow: string
  }
}

export default DeviceWearerPageContent
