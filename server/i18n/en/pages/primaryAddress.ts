import AddressPageContent from '../../../types/i18n/pages/address'

const primaryAddressPageContent: AddressPageContent = {
  helpText:
    'If the device wearer has more than one address, enter the address they are legally registered at. If they divide their time across properties, enter the address they spend the most time or consider their home address.',
  legend: "What is the device wearer's main address?",
  questions: {
    hasAnotherAddress: {
      text: 'Are electronic monitoring devices required at another address?',
      hint: "Examples include education, work, or living part-time at a relative, parent or partner's address.",
    },
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
  section: 'Contact information',
  title: 'Main address',
}

export default primaryAddressPageContent
