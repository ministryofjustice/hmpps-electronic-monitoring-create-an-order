import VariationDetailsPageContent from '../../../types/i18n/pages/variationDetails'

const variationDetailsPageContent: VariationDetailsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    variationDate: {
      text: 'What is the date you want the changes to take effect?',
      hint: 'For example, 21 05 2025',
    },
    variationDetails: {
      text: 'Provide additional information about the changes',
      hint: '',
    },
    variationDetailsAvailable: {
      text: 'Is there any other information to be aware of about the changes?',
      hint: '',
    },
  },
  section: 'About the changes in this version of the form',
  title: 'Details of the changes',
}

export default variationDetailsPageContent
