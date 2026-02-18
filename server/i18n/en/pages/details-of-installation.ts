import DetailsOfInstallationPageContent from '../../../types/i18n/pages/detailsOfInstallation'

const detailsOfInstallationPageContent: DetailsOfInstallationPageContent = {
  helpText: '',
  legend: '',
  questions: {
    possibleRisk: {
      text: "At installation what are the possible risks from the device wearer's behaviour?",
      hint: 'Check if there are any alerts for the device wearer. Select all that apply',
    },
    riskCategory: {
      text: 'What are the possible risks at the installation address? (optional)',
      hint: "Risks relate to the device wearer's behaviour and installation address. Select all that apply",
    },
    riskDetails: {
      text: 'Any other risks to be aware of? (optional)',
      hint: "Provide additional risk information about the device wearer's behaviour or the installation address.",
    },
  },
  section: 'Risk information',
  title: 'Risk at installation',
}

export default detailsOfInstallationPageContent
