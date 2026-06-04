import CurfewReleaseDatePageContent from '../../../types/i18n/pages/curfewReleaseDate'

const curfewReleaseDatePageContent: CurfewReleaseDatePageContent = {
  helpText: '',
  legend: '',
  questions: {
    endTime: {
      text: 'On the day after release, what time does the curfew end?',
      hint: 'Enter time using a 24 hour clock. For example 19:00 instead of 7:00pm.',
    },
    startTime: {
      text: 'On the day of release, what time does the curfew start?',
      hint: 'Enter time using a 24 hour clock. For example 19:00 instead of 7:00pm.',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Curfew on release day',
}

export default curfewReleaseDatePageContent
