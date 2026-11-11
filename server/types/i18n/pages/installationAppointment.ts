import QuestionPageContent from './questionPage'

type InstallationAppointmentPageContent = QuestionPageContent<
  | 'placeName'
  | 'prisonName'
  | 'appointmentDate'
  | 'appointmentTime'
  | 'preferredAppointmentTime'
  | 'appointmentTimeDetails'
>

export default InstallationAppointmentPageContent
