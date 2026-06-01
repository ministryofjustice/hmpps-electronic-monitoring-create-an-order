import QuestionPageContent from './questionPage'

type InstallationAppointmentPageContent = QuestionPageContent<
  'placeName' | 'appointmentDate' | 'appointmentTime' | 'preferredAppointmentTime'
>

export default InstallationAppointmentPageContent
