import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CheckYourAnswersPage from '../../../pages/order/about-the-device-wearer/check-your-answers'

const mockOrderId = uuidv4()

context('Device wearer - check your answers', () => {
  context('Order that failed to submit to Serco', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          deviceWearer: {
            nomisId: 'nomis',
            pncId: 'pnc',
            deliusId: 'delius',
            prisonNumber: 'prison',
            homeOfficeReferenceNumber: 'ho',
            firstName: 'test',
            lastName: 'tester',
            alias: 'tes',
            dateOfBirth: '2000-01-01T00:00:00Z',
            adultAtTimeOfInstallation: true,
            sex: 'MALE',
            gender: 'MALE',
            disabilities: 'MENTAL_HEALTH',
            otherDisability: null,
            noFixedAbode: null,
            interpreterRequired: false,
          },
          fmsResultDate: new Date('2024 12 14'),
          DeviceWearerResponsibleAdult: null,
        },
      })

      cy.signIn()
    })

    it('should show answers without any actions', () => {
      const page = Page.visit(CheckYourAnswersPage, { orderId: mockOrderId }, {}, 'View answers')

      // Should show the correct answers
      page.personDetailsSection.shouldExist()
      page.personDetailsSection.shouldHaveItems([
        { key: "What is the device wearer's first name?", value: 'test' },
        { key: "What is the device wearer's last name?", value: 'tester' },
        { key: "What is the device wearer's preferred name or names? (optional)", value: 'tes' },
        { key: "What is the device wearer's date of birth?", value: '01/01/2000' },
        { key: 'Is a responsible adult required?', value: 'No' },
        { key: 'What is the sex of the device wearer?', value: 'Male' },
        { key: "What is the device wearer's gender?", value: 'Male' },
        {
          key: 'Does the device wearer have any of the disabilities or health conditions listed? (optional)',
          value: 'Mental health',
        },
        { key: 'What language does the interpreter need to use? (optional)', value: '' },
        { key: 'Is an interpreter needed?', value: 'No' },
      ])
      page.personDetailsSection.shouldNotHaveItems([
        "What is the device wearer's disability or health condition?",
        "What is the device wearer's chosen identity?",
      ])
      page.identityNumbersSection.shouldExist()
      page.identityNumbersSection.shouldHaveItems([
        { key: 'National Offender Management Information System (NOMIS) ID (optional)', value: 'nomis' },
        { key: 'Police National Computer (PNC) ID (optional)', value: 'pnc' },
        { key: 'Delius ID (optional)', value: 'delius' },
        { key: 'Prison number (optional)', value: 'prison' },
        { key: 'Home Office Reference Number (optional)', value: 'ho' },
      ])
      page.responsibleAdultSection.shouldNotExist()

      // Should not have any "change" links
      page.changeLinks.should('not.exist')

      // Should show the correct buttons
      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
