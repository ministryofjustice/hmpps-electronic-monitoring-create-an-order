import DetailsOfInstallationPageContent from '../../../types/i18n/pages/detailsOfInstallation'

const detailsOfInstallationPageContent: DetailsOfInstallationPageContent = {
  helpText: '',
  legend: '',
  questions: {
    offence: {
      text: 'What type of offence did the device wearer commit?',
      hint: '',
    },
    possibleRisk: {
      text: "At installation what are the possible risks from the device wearer's behaviour?",
      hint: 'Check if there are any alerts for the device wearer. Select all that apply',
    },
    riskCategory: {
      text: 'What are the possible risks at the installation address? (optional)',
      hint: "Risks relate to the device wearer's behaviour and installation address. Select all that apply",
    },
    riskAtAddress: {
      text: 'At installation what are the possible risks at the address?',
      hint: 'Answer questions based on what you know now. Risk can be updated when more is known about the address and who lives there.',
    },
    riskDetails: {
      text: 'Any other risks to be aware of? (optional)',
      hint: "Provide additional risk information about the device wearer's behaviour or the installation address.",
    },
    genderRiskDetails: {
      text: 'What sex or gender are they a risk to?',
      hint: 'For example, Women',
    },
    otherRisks: {
      text: 'Are there other risks to be aware of?',
      hint: '',
    },
    otherRisksDetails: {
      text: 'What other risks are there to be aware of?',
      hint: 'Information subject to sensitive processing must only be shared with the offenders consent or where strictly necessary for the purpose of the EMS managing risk.',
    },
  },
  section: 'Risk information',
  title: 'Risk at installation',
}

export default detailsOfInstallationPageContent
