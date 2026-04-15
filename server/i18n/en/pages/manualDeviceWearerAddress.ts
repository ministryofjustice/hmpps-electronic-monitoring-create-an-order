import AddressPageContent from '../../../types/i18n/pages/address'

const deviceWearerAddressPageContent: Omit<AddressPageContent, 'questions'> & {
  questions: Omit<AddressPageContent['questions'], 'hasAnotherAddress'>
} = {
  title: "What is the device wearer's address?",
  section: 'About the device wearer',
  legend: '',
  helpText: '',
  questions: {
    addressLine1: {
      text: 'Address line 1',
    },
    addressLine2: {
      text: 'Address line 2 (optional)',
    },
    addressLine3: {
      text: 'Town or city',
    },
    addressLine4: {
      text: 'County (optional)',
    },
    postcode: {
      text: 'Postcode',
    },
  },
}

export default deviceWearerAddressPageContent
