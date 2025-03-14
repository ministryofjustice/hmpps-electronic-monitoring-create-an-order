import AddressPageContent from '../../../types/i18n/pages/address'

const secondaryAddressPageContent: AddressPageContent = {
  helpText: '',
  legend: "What is the device wearer's second address?",
  questions: {
    hasAnotherAddress: {
      text: 'Are electronic monitoring devices required at another address?',
      hint: "Examples include education, work, or living part-time at a relative, parent or partner's address.",
    },
    line1: {
      text: 'Address line 1',
    },
    line2: {
      text: 'Address line 2 (optional)',
    },
    line3: {
      text: 'Town or city',
    },
    line4: {
      text: 'County (optional)',
    },
    postcode: {
      text: 'Postcode',
    },
  },
  section: 'Contact information',
  title: "Device wearer's second address",
}

export default secondaryAddressPageContent
