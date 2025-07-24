import NoFixedAbodePageContent from '../../../types/i18n/pages/noFixedAbode'

const noFixedAbodePageContent: NoFixedAbodePageContent = {
  helpText: [
    'A fixed address is the address the device wearer has registered as their home address. It can be temporary accommodation, an Approved Premises (AP), a fixed tenancy or a permanent address.',
    'A fixed address is required to process all monitoring orders apart from those that include Alcohol monitoring or where the device wearer is part of the Acquisitive Crime (AC) Project.',
    "For all other orders you should not raise the order until you have the device wearer's address. If the address isn’t available at the time of release, probation will be responsible for the order.",
  ],
  legend: '',
  questions: {
    noFixedAbode: {
      text: 'Does the device wearer have a fixed address?',
    },
  },
  section: 'Contact information',
  title: 'Fixed address',
}

export default noFixedAbodePageContent
