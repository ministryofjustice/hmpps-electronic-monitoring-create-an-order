import AddressPageContent from '../../../types/i18n/pages/address'

const addressPageContent: AddressPageContent = {
  questions: {
    hasAnotherAddress: {
      text: 'Does the device wearer have another address they will be monitored at?',
      hint: 'For example, the device wearer will spend curfew hours at another address. Examples of additional addresses include living part time in another address due to separated parents or living on-site at a school or university during term time.',
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
  title: "What is the device wearer's primary address?",
}

export default addressPageContent
