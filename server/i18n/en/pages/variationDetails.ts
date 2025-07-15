import VariationDetailsPageContent from '../../../types/i18n/pages/variationDetails'

const variationDetailsPageContent: VariationDetailsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    variationDate: {
      text: 'What is the date you want the changes to take effect?',
      hint: 'For example, 21 05 2025',
    },
    variationType: {
      text: 'What have you changed in the form?',
    },
    variationDetails: {
      text: 'Enter information on what you have changed',
      hint: 'This text will be sent with your changes to help the installer quickly understand what has changed and what they need to do.',
    },
  },
  section: 'About the changes in this version of the form',
  title: 'Details of the changes',
}

export default variationDetailsPageContent
