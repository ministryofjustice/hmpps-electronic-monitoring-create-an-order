import AddressPageContent from '../../../types/i18n/pages/address'

const installationAddressPageContent: AddressPageContent = {
  helpText: 'For installation at source this is the address of the prison or probation office.',
  legend: '',
  questions: {
    hasAnotherAddress: {
      text: '',
      hint: '',
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
  section: 'Electronic monitoring required',
  title: 'At what address will installation of the electronic monitoring device take place?',
}

export default installationAddressPageContent
