import CurfewAdditionalDetailsPageContent from '../../../types/i18n/pages/curfewAdditionalDetails'

const curfewConditionsPageContent: CurfewAdditionalDetailsPageContent = {
  helpText: '',
  legend: '',
  questions: {
    provideDetails: {
      text: 'Do you want to change the standard curfew address boundary for any of the curfew addresses?',
    },
    curfewAdditionalDetails: {
      text: 'Enter details of what the curfew address boundary should include',
      hint: 'For example, access to the patio up to the lawn at the main curfew address.',
    },
  },
  section: 'Electronic monitoring required',
  title: 'Curfew address boundary',
}

export default curfewConditionsPageContent
