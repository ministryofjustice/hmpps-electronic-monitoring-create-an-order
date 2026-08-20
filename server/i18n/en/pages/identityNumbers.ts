import IdentityNumbersPageContent from '../../../types/i18n/pages/identityNumbers'

const identityNumbersPageContent: IdentityNumbersPageContent = {
  helpText: 'Select and enter all identity numbers that you have for the device wearer.',
  legend: 'What identity numbers do you have for the device wearer?',
  questions: {
    deliusId: {
      text: 'Case Reference Number (CRN)',
    },
    nomisId: {
      text: 'Prison number',
      hint: "This is sometimes known as a 'NOMIS number' or 'alpha number'. For example, A1234BC",
    },
    pncId: {
      text: 'Police National Computer (PNC)',
    },
    complianceAndEnforcementPersonReference: {
      text: 'Compliance and Enforcement Person Reference (CEPR)',
    },
    courtCaseReferenceNumber: {
      text: 'Court Case Reference Number (CCRN)',
    },
    prisonNumber: {
      text: 'Prison Number',
    },
    homeOfficeReferenceNumber: {
      text: 'Home Office Reference Number',
    },
  },
  inputLabels: {
    deliusId: 'Enter CRN',
    nomisId: 'Enter prison number',
    pncId: 'Enter PNC',
    complianceAndEnforcementPersonReference: 'Enter Compliance and Enforcement Person Reference',
    courtCaseReferenceNumber: 'Enter Court Case Reference Number',
    prisonNumber: 'Enter Prison Number',
    homeOfficeReferenceNumber: 'Enter Home Office Reference Number',
  },
  singleQuestionTitles: {
    deliusId: "What is the device wearer's Case Reference Number (CRN)?",
    nomisId: "What is the device wearer's prison number?",
    pncId: "What is the device wearer's Police National Computer (PNC) number?",
    complianceAndEnforcementPersonReference:
      "What is the device wearer's Compliance and Enforcement Person Reference (CEPR)?",
    courtCaseReferenceNumber: "What is the device wearer's Court Case Reference Number (CCRN)?",
    prisonNumber: "What is the device wearer's prison number?",
    homeOfficeReferenceNumber: "What is the device wearer's Home Office Reference Number?",
  },
  section: 'About the device wearer',
  title: 'What identity numbers do you have for the device wearer?',
}

export default identityNumbersPageContent
