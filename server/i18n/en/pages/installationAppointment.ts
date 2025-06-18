import InstallationAppointmentPageContent from '../../../types/i18n/pages/installationAppointment'

const installationAppointmentPageContent: InstallationAppointmentPageContent = {
  section: 'Electronic monitoring required',
  title: 'Installation appointment',
  helpText: '',
  legend: '',
  questions: {
    placeName: {
      text: 'What is the name of the place where installation will take place?',
      hint: 'For example, the name of the prison or probation office.',
    },
    appointmentDate: {
      text: 'What date will installation take place?',
      hint: 'For example, 21 05 2025',
    },
    appointmentTime: {
      text: 'What time will installation take place?',
      hint: 'Enter time using a 24 hour clock. For example, enter 14:30 instead of 2:30pm',
    },
  },
}

export default installationAppointmentPageContent
