import IdentityNumbersPageContent from '../../../types/i18n/pages/identityNumbers'

const identityNumbersPageContent: IdentityNumbersPageContent = {
  helpText: 'Enter all identity numbers that you have for the device wearer.',
  legend: "What is the device wearer's identity number?",
  questions: {
    deliusId: {
      text: 'Delius ID (optional)',
    },
    homeOfficeReferenceNumber: {
      text: 'Home Office Reference Number (optional)',
    },
    nomisId: {
      text: 'National Offender Management Information System (NOMIS) ID (optional)',
    },
    pncId: {
      text: 'Police National Computer (PNC) ID (optional)',
    },
    prisonNumber: {
      text: 'Prison number (optional)',
    },
  },
  section: 'About the device wearer',
  title: 'Identity numbers',
}

export default identityNumbersPageContent
