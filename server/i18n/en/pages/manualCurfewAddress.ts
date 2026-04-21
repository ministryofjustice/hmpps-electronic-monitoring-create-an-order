import AddressPageContent from '../../../types/i18n/pages/address'

const manualCurfewAddressPageContent: Omit<AddressPageContent, 'questions'> & {
  questions: Omit<AddressPageContent['questions'], 'hasAnotherAddress'>
} = {
  title: 'What is the curfew address?',
  section: 'Electronic monitoring required',
  legend: '',
  helpText: 'For installation at source this is the address of the prison or probation office.',
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

export default manualCurfewAddressPageContent
