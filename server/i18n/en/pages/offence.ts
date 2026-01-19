import OffenceContent from '../../../types/i18n/pages/offence'

const offenceContent: OffenceContent = {
  helpText:
    'Enter details of the offence the device wearer has committed. You will be able to add more offences later if you need to.',
  legend: '',
  questions: {
    offenceType: {
      text: 'What type of offence did the device wearer commit?',
    },
    offenceDate: {
      text: 'What was the date of the offence?',
      hint: 'For example, 31 3 1980',
    },
  },
  section: 'Access needs and installation risk',
  title: 'Offence details',
}

export default offenceContent
