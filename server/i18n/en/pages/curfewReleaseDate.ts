import CurfewReleaseDatePageContent from '../../../types/i18n/pages/curfewReleaseDate'

const curfewReleaseDatePageContent: CurfewReleaseDatePageContent = {
  helpText: '',
  legend: '',
  questions: {
    address: {
      text: 'On the day of release, where will the device wearer be during curfew hours?',
      hint: "Select one address. Addresses listed are those entered earlier in the form. Go to the 'Contact information' section to edit address information.",
    },
    endTime: {
      text: 'On the day of release, what time does the curfew end?',
      hint: 'Enter time using a 24 hour clock. For example 19:00 instead of 7:00pm.',
    },
    releaseDate: {
      text: 'What date is the device wearer released from custody?',
      hint: 'For example, 21 05 2025',
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
