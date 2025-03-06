import AddressPageContent from '../../../types/i18n/pages/address'

const tertiaryAddressPageContent: AddressPageContent = {
  helpText: '',
  legend: "What is the device wearer's third address?",
  questions: {
    hasAnotherAddress: {
      text: '',
      hint: '',
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
  title: "Device wearer's third address",
}

export default tertiaryAddressPageContent
