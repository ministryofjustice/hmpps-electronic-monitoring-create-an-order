import AttendancePageContent from '../../../types/i18n/pages/attendance'

const attendancePageContent: AttendancePageContent = {
  helpText: '',
  legend: '',
  questions: {
    addAnother: {
      text: 'Do you need to add another appointment?',
    },
    appointmentDay: {
      text: 'On what day is the appointment and how frequently does the appointment take place?',
      hint: 'For example, fortnightly on Mondays. Only include one day and frequency, if the same type of appointment occurs on another day on the same week enter this as a separate appointment.',
    },
    endDate: {
      text: 'What date does mandatory attendance monitoring end? (optional)',
      hint: 'For example, 21 05 2025',
    },
    endTime: {
      text: 'What time does the appointment end?',
      hint: 'Enter time using a 24 hour clock. For example 14:30 instead of 2.30pm',
    },
    purpose: {
      text: 'What is the appointment for?',
      hint: 'For example, education or medical appointment',
    },
    startDate: {
      text: 'What date does mandatory attendance monitoring start?',
      hint: 'For example, 21 05 2025',
    },
    startTime: {
      text: 'What time does the appointment start?',
      hint: 'Enter time using a 24 hour clock. For example 14:30 instead of 2.30pm',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Mandatory attendance monitoring',
}

export default attendancePageContent
