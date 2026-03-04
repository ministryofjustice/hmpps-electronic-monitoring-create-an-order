import QuestionPageContent from '../../../types/i18n/pages/questionPage'

type FindAddressViewModel = { content: QuestionPageContent<'postcode' | 'buildingId'> }

const construct = (): FindAddressViewModel => {
  return {
    content: {
      title: "Find the device wearer's address",
      section: 'About the device wearer',
      legend: '',
      helpText: '',
      questions: {
        postcode: {
          text: 'Postcode',
          hint: 'For example, AA3 1AB',
        },
        buildingId: {
          text: 'Building number or name (optional)',
          hint: 'For example, 15 or Prospect Cottage',
        },
      },
    },
  }
}

export default { construct }
