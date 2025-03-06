import CurfewConditionsPageContent from '../../../types/i18n/pages/curfewConditions'

const curfewConditionsPageContent: CurfewConditionsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    addresses: {
      text: 'Where will the device wearer be during curfew hours?',
      hint: "Select all addresses the device wearer will use during curfew hours. Go to the 'Contact information' section to edit address information",
    },
    endDate: {
      text: 'What date does the curfew end? (optional)',
    },
    startDate: {
      text: 'What date does the curfew start?',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Curfew',
}

export default curfewConditionsPageContent
