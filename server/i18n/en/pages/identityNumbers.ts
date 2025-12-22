import IdentityNumbersPageContent from '../../../types/i18n/pages/identityNumbers'

const identityNumbersPageContent: IdentityNumbersPageContent = {
  helpText: 'Enter all identity numbers that you have for the device wearer.',
  legend: "What is the device wearer's identity number?",
  questions: {
    pncId: {
      text: 'Police National Computer (PNC)',
    },
    nomisId: {
      text: 'National Offender Management Information System (NOMIS)',
    },
    prisonNumber: {
      text: 'Prison number',
    },
    deliusId: {
      text: 'NDelius ID',
    },
    ceprId: {
      text: 'Compliance and Enforcement Person Reference (CEPR)',
    },
    ccrnId: {
      text: 'Court Case Reference Number (CCRN)',
    },
  },
  section: 'About the device wearer',
  title: 'Identity numbers',
}

export default identityNumbersPageContent
