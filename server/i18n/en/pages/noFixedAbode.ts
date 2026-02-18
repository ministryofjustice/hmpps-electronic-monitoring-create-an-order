import NoFixedAbodePageContent from '../../../types/i18n/pages/noFixedAbode'

const noFixedAbodePageContent: NoFixedAbodePageContent = {
  helpText: [
    'A fixed address is the address the device wearer has registered as their home address. It can be temporary accommodation, an Approved Premises (AP), a fixed tenancy or a permanent address.',
    'A fixed address is required to process all monitoring orders apart from those that include Alcohol monitoring.',
  ],
  warning:
    "Unless the order is for an immigration case or includes alcohol monitoring, wait to raise it until you have the device wearer's address. For Acquisitive Crime (EMAC) orders with no fixed address at release, probation are responsible for raising the order once an address is confirmed.",
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
