import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import InstallationAndRiskCheckYourAnswersPage from '../../../pages/order/installation-and-risk/check-your-answers'
import OrderTasksPage from '../../../pages/order/summary'
import MonitoringConditionsCheckYourAnswersPage from '../../../pages/order/monitoring-conditions/check-your-answers'

const mockOrderId = uuidv4()

context('installation and risk - check your answers', () => {
  context('Draft order', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: { dataDictionaryVersion: 'DDV5' },
      })

      cy.signIn()
    })

    const pageHeading = 'Check your answers'

    it('Should display the user name visible in header', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.header.userName().should('contain.text', 'J. Smith')
    })

    it('Should display the phase banner in header', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.header.phaseBanner().should('contain.text', 'dev')
    })

    it('Should render the save and continue, and return buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })

    it('Should be accessible', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
      page.checkIsAccessible()
    })
  })

  context('risk information check answers page', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          dataDictionaryVersion: 'DDV5',
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'some offence details',

            riskCategory: ['RISK_TO_GENDER', 'IOM'],
            riskDetails: 'some risk details',
            mappaLevel: null,
            mappaCaseType: null,
          },
        },
      })
      cy.signIn()
    })

    const pageHeading = 'Check your answers'

    it('shows risk information caption', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit?', value: 'Sexual offences' },
        {
          key: 'Any other information to be aware of about the offence committed? (optional)',
          value: 'some offence details',
        },
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Offensive towards someone because of their sex or gender',
        },
        { key: 'Any other risks to be aware of? (optional)', value: 'some risk details' },
      ])
    })

    it('does show "change" links', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Save and go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Save as draft')
    })
  })

  context('risk information check answers page submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          dataDictionaryVersion: 'DDV5',
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'some offence details',
            riskCategory: ['RISK_TO_GENDER', 'IOM', 'HISTORY_OF_SUBSTANCE_ABUSE'],
            riskDetails: 'some risk details',
            mappaLevel: null,
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })
      cy.signIn()
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'You are viewing a submitted form. This form was submitted on the 14 December 2024.',
      )
    })

    it('shows correct caption and heading', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit?', value: 'Sexual offences' },
        {
          key: 'Any other information to be aware of about the offence committed? (optional)',
          value: 'some offence details',
        },
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Offensive towards someone because of their sex or gender',
        },
        {
          key: 'What are the possible risks at the installation address? (optional)',
          value: 'Managed through IOM',
        },
        {
          key: 'What are the possible risks at the installation address? (optional)',
          value: 'History of substance abuse',
        },
        { key: 'Any other risks to be aware of? (optional)', value: 'some risk details' },
      ])
    })

    it('does not show "change" links', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })

  context('risk information check answers page failed to submit', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          dataDictionaryVersion: 'DDV5',
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'some offence details',
            riskCategory: ['RISK_TO_GENDER', 'IOM'],
            riskDetails: 'some risk details',
            mappaLevel: null,
            mappaCaseType: null,
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })
      cy.signIn()
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'This form failed to submit. This was due to a technical problem. For more information ',
      )
      page.submittedBanner.contains('a', 'view the guidance (opens in a new tab)')
    })

    it('shows correct caption and heading', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit?', value: 'Sexual offences' },
        {
          key: 'Any other information to be aware of about the offence committed? (optional)',
          value: 'some offence details',
        },
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Offensive towards someone because of their sex or gender',
        },
        { key: 'Any other risks to be aware of? (optional)', value: 'some risk details' },
      ])
    })

    it('does not show "change" links', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })

  context('Viewing an old version', () => {
    const mockVersionId = uuidv4()
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetVersion', {
        httpStatus: 200,
        id: mockOrderId,
        versionId: mockVersionId,
        status: 'SUBMITTED',
        order: {
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'some offence details',
            riskCategory: ['RISK_TO_GENDER', 'IOM'],
            riskDetails: 'some risk details',
            mappaLevel: 'MAPPA 1',
            mappaCaseType: 'SOC (Serious Organised Crime)',
          },
          fmsResultDate: new Date('2024 12 14'),
        },
      })

      cy.signIn()
    })

    const pageHeading = 'View answers'

    it('navigates correctly to summary', () => {
      const page = Page.visit(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId, versionId: mockVersionId },
        {},
        pageHeading,
        true,
      )

      page.returnButton().click()

      Page.verifyOnPage(OrderTasksPage, { orderId: mockOrderId, versionId: mockVersionId }, {}, true)
    })

    it('navigates correctly to next section', () => {
      const page = Page.visit(
        InstallationAndRiskCheckYourAnswersPage,
        { orderId: mockOrderId, versionId: mockVersionId },
        {},
        pageHeading,
        true,
      )

      page.continueButton().click()

      Page.verifyOnPage(
        MonitoringConditionsCheckYourAnswersPage,
        { orderId: mockOrderId, versionId: mockVersionId },
        {},
        pageHeading,
        true,
      )
    })
  })

  context('DDV4', () => {
    const pageHeading = 'View answers'
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            offenceAdditionalDetails: 'some offence details',
            riskCategory: ['RISK_TO_GENDER', 'IOM'],
            riskDetails: 'some risk details',
            mappaLevel: null,
            mappaCaseType: null,
          },
          fmsResultDate: new Date('2024 12 14'),
          dataDictionaryVersion: 'DDV4',
        },
      })
      cy.signIn()
    })

    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('shows the correct answers for checking', () => {
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'What type of offence did the device wearer commit?', value: 'Sexual offences' },
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Offensive towards someone because of their sex or gender',
        },
      ])
      page.installationRiskSection.shouldNotHaveItem(
        'Any other information to be aware of about the offence committed? (optional)',
      )
    })
  })

  context('DDV6', () => {
    const pageHeading = 'Check your answers'
    beforeEach(() => {
      cy.task('reset')

      const testFlags = { OFFENCE_FLOW_ENABLED: 'true' }
      cy.task('setFeatureFlags', testFlags)

      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.signIn()
    })

    afterEach(() => {
      cy.task('resetFeatureFlags')
    })

    it('family court dapo clauses', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'FAMILY_COURT',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          dapoClauses: [
            {
              clause: '12345',
              date: new Date(2025, 1, 1),
            },
            {
              clause: '56789',
              date: new Date(2025, 2, 2),
            },
          ],
          dataDictionaryVersion: 'DDV6',
        },
      })
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'DAPO order clauses', value: '12345 on 01/02/2025' },
        { key: 'DAPO order clauses', value: '56789 on 02/03/2025' },
      ])
      page.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    })

    it('Civil court offences', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'CIVIL_COUNTY_COURT',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          offences: [
            {
              offenceType: 'SEXUAL_OFFENCES',
              offenceDate: new Date(2025, 1, 1),
            },
            {
              offenceType: 'CRIMINAL_DAMAGE_AND_ARSON',
              offenceDate: new Date(2025, 2, 2),
            },
          ],
          dataDictionaryVersion: 'DDV6',
        },
      })
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'Offences', value: 'Sexual offences on 01/02/2025' },
        { key: 'Offences', value: 'Criminal damage and arson on 02/03/2025' },
      ])
      page.installationRiskSection.shouldNotHaveItem('What type of offence did the device wearer commit?')
    })

    it('home office show mappa', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'HOME_OFFICE',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          mappa: {
            level: 'MAPPA_ONE',
            category: 'CATEGORY_ONE',
            isMappa: 'YES',
          },
          dataDictionaryVersion: 'DDV6',
        },
      })
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        { key: 'Is the device wearer a Multi-Agency Public Protection Arrangements (MAPPA) offender?', value: 'Yes' },
        { key: 'Which level of MAPPA applies to the device wearer?', value: 'MAPPA 1' },
        { key: 'Which category of MAPPA applies to the device wearer?', value: 'Category 1' },
      ])
    })

    it('not home office dont show mappa', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'CIVIL_COUNTY_COURT',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          mappa: {
            level: 'MAPPA_ONE',
            category: 'CATEGORY_ONE',
          },
          dataDictionaryVersion: 'DDV6',
        },
      })
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldNotHaveItem('Which level of MAPPA applies to the device wearer? (optional)')
      page.installationRiskSection.shouldNotHaveItem('Which category of MAPPA applies to the device wearer? (optional)')
    })

    it('shows offence other info details', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          interestedParties: {
            notifyingOrganisation: 'CIVIL_COUNTY_COURT',
            notifyingOrganisationName: '',
            notifyingOrganisationEmail: '',
            responsibleOfficerName: '',
            responsibleOfficerPhoneNumber: '',
            responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
            responsibleOrganisationEmail: '',
            responsibleOrganisationRegion: '',
          },
          installationAndRisk: {
            offence: 'SEXUAL_OFFENCES',
            riskCategory: [],
            possibleRisk: [],
            riskDetails: '',
            mappaLevel: null,
            mappaCaseType: null,
            offenceAdditionalDetails: 'test',
          },
          offences: [
            {
              offenceType: 'SEXUAL_OFFENCES',
              offenceDate: new Date(2025, 1, 1),
            },
            {
              offenceType: 'CRIMINAL_DAMAGE_AND_ARSON',
              offenceDate: new Date(2025, 2, 2),
            },
          ],
          offenceAdditionalDetails: {
            additionalDetails: 'mock offence details',
          },
          dataDictionaryVersion: 'DDV6',
        },
      })

      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        {
          key: 'Any other information to be aware of about the offence committed?',
          value: 'mock offence details',
        },
      ])
      page.installationRiskSection.shouldNotHaveItem(
        'Any other information to be aware of about the offence committed? (optional)',
      )
    })

    it('shows risk answers', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        order: {
          detailsOfInstallation: {
            riskCategory: ['THREATS_OF_VIOLENCE', 'SAFEGUARDING_CHILD'],
            riskDetails: 'some risk details',
          },
          dataDictionaryVersion: 'DDV6',
        },
      })
      const page = Page.visit(InstallationAndRiskCheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

      page.installationRiskSection.shouldExist()
      page.installationRiskSection.shouldHaveItems([
        {
          key: "At installation what are the possible risks from the device wearer's behaviour?",
          value: 'Violent behaviour or threats of violence',
        },
        {
          key: 'What are the possible risks at the installation address? (optional)',
          value: 'Safeguarding child',
        },
        {
          key: 'Any other risks to be aware of? (optional)',
          value: 'some risk details',
        },
      ])
    })
  })
})
