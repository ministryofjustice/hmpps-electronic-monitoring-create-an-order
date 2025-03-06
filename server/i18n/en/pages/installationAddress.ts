import AddressPageContent from '../../../types/i18n/pages/address'

const installationAddressPageContent: AddressPageContent = {
  helpText:
    'This is the address where the electronic monitoring device will be fitted on to the body of the device wearer.',
  legend: 'Where will the installation of the electronic monitoring device take place?',
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
  section: 'Electronic monitoring required',
  title: 'Installation address',
}

export default installationAddressPageContent
