import NewDocumentPageContent from '../../../types/i18n/pages/newDocument'

const newDocumentPageContent: NewDocumentPageContent = {
  helpText: '',
  legend: '',
  questions: {
    newDocument: {
      text: 'Do you need to upload a new document?',
      guidance: {
        intro: 'You need to upload:',
        items: [
          'An updated licence if the electronic monitoring conditions have changed.',
          'Recall paperwork if the device wearer has been recalled to prison.',
        ],
        outro: 'Your order will be rejected if the required paperwork is missing or does not match the new order.',
      },
    },
  },
  section: 'Additional documents',
  title: 'Check if you need to upload a new document',
}

export default newDocumentPageContent
