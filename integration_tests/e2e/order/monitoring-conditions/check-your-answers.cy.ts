import { v4 as uuidv4 } from 'uuid'
import Page from '../../../pages/page'
import CheckYourAnswers from '../../../pages/order/monitoring-conditions/check-your-answers'

const mockOrderId = uuidv4()

context('Check your answers', () => {
  context('Application in progress', () => {
    const mockOrder = {
      monitoringConditions: {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-02-01T00:00:00Z',
        orderType: 'CIVIL',
        curfew: true,
        exclusionZone: true,
        trail: true,
        mandatoryAttendance: true,
        alcohol: true,
        conditionType: 'BAIL_ORDER',
        orderTypeDescription: 'DAPO',
        sentenceType: 'IPP',
        issp: 'YES',
        hdc: 'NO',
        prarr: 'UNKNOWN',
      },
      curfewReleaseDateConditions: {
        curfewAddress: '',
        releaseDate: '2025-05-11',
        startTime: '19:00:00',
        endTime: '07:00:00',
      },
      installationLocation: {
        location: 'INSTALLATION',
      },
      addresses: [
        {
          addressType: 'INSTALLATION',
          addressLine1: '10 Downing Street',
          addressLine2: 'London',
          addressLine3: '',
          addressLine4: '',
          postcode: 'SW1A 2AB',
        },
      ],
    }
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: mockOrder,
      })

      cy.signIn()
    })

    const pageHeading = 'Check your answers'

    it('shows answers for checking', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.monitoringConditionsSection().should('exist')
      page.installationAddressSection().should('exist')
      page.curfewOnDayOfReleaseSection.shouldExist()
      page.curfewOnDayOfReleaseSection.shouldHaveItems([
        { key: 'What date is the device wearer released from custody?', value: '11/05/2025' },
        { key: 'On the day of release, what time does the curfew start?', value: '19:00' },
        { key: 'On the day after release, what time does the curfew end?', value: '07:00' },
      ])
      page.curfewSection().should('exist')
      page.curfewTimetableSection().should('exist')
      page.trailMonitoringConditionsSection().should('exist')
      page.alcoholMonitoringConditionsSection().should('exist')
    })

    it('shows installation location - Primary', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          ...mockOrder,
          installationLocation: {
            location: 'PRIMARY',
          },
          addresses: [
            {
              addressType: 'PRIMARY',
              addressLine1: '10 Downing Street',
              addressLine2: 'London',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 2AB',
            },
          ],
        },
      })

      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)
      page.installationLocationSection().shouldExist()
      page.installationLocationSection().shouldHaveItems([
        {
          key: 'Where will installation of the electronic monitoring device take place?',
          value: '10 Downing Street, London, SW1A 2AB',
        },
      ])
      page.installationAddressSection().should('not.exist')
    })

    it('shows installation location - Prison', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          ...mockOrder,
          installationLocation: {
            location: 'PRISON',
          },
        },
      })

      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)
      page.installationLocationSection().shouldExist()
      page
        .installationLocationSection()
        .shouldHaveItems([
          { key: 'Where will installation of the electronic monitoring device take place?', value: 'At a prison' },
        ])
      page.installationAddressSection().should('exist')
    })

    it('shows installation location - Probation Office', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          ...mockOrder,
          installationLocation: {
            location: 'PROBATION_OFFICE',
          },
        },
      })

      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)
      page.installationLocationSection().shouldExist()
      page.installationLocationSection().shouldHaveItems([
        {
          key: 'Where will installation of the electronic monitoring device take place?',
          value: 'At a probation office',
        },
      ])
      page.installationAddressSection().should('exist')
    })

    it('shows installation location - INSTALLATION', () => {
      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'IN_PROGRESS',
        order: {
          ...mockOrder,
          installationLocation: {
            location: 'INSTALLATION',
          },
        },
      })

      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)
      page.installationLocationSection().shouldExist()
      page.installationLocationSection().shouldHaveItems([
        {
          key: 'Where will installation of the electronic monitoring device take place?',
          value: 'At another address',
        },
      ])
      page.installationAddressSection().should('exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.returnButton().should('exist')
    })
  })

  context('Application status is submitted', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'SUBMITTED',
        order: {
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          },
          installationLocation: {
            location: 'INSTALLATION',
          },
          addresses: [
            {
              addressType: 'INSTALLATION',
              addressLine1: '10 Downing Street',
              addressLine2: 'London',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 2AB',
            },
          ],
          fmsResultDate: new Date('2024 12 14'),
        },
      })
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'You are viewing a submitted form. This form was submitted on the 14 December 2024.',
      )
    })

    it('shows correct caption and heading', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.monitoringConditionsSection().should('exist')
      page.installationAddressSection().should('exist')
      page.curfewOnDayOfReleaseSection.shouldExist()
      page.curfewSection().should('exist')
      page.curfewTimetableSection().should('exist')
      page.trailMonitoringConditionsSection().should('exist')
      page.alcoholMonitoringConditionsSection().should('exist')
    })

    it('does not show "change" links', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })

  context('Application status is error', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
      cy.signIn()

      cy.task('stubCemoGetOrder', {
        httpStatus: 200,
        id: mockOrderId,
        status: 'ERROR',
        order: {
          monitoringConditions: {
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-02-01T00:00:00Z',
            orderType: 'CIVIL',
            curfew: true,
            exclusionZone: true,
            trail: true,
            mandatoryAttendance: true,
            alcohol: true,
            conditionType: 'BAIL_ORDER',
            orderTypeDescription: 'DAPO',
            sentenceType: 'IPP',
            issp: 'YES',
            hdc: 'NO',
            prarr: 'UNKNOWN',
          },
          installationLocation: {
            location: 'INSTALLATION',
          },
          addresses: [
            {
              addressType: 'INSTALLATION',
              addressLine1: '10 Downing Street',
              addressLine2: 'London',
              addressLine3: '',
              addressLine4: '',
              postcode: 'SW1A 2AB',
            },
          ],
          fmsResultDate: new Date('2024 12 14'),
        },
      })
    })

    const pageHeading = 'View answers'

    it('shows correct banner', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.submittedBanner.contains(
        'This form failed to submit. This was due to a technical problem. For more information ',
      )
      page.submittedBanner.contains('a', 'view the guidance (opens in a new tab)')
    })

    it('shows correct caption and heading', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.checkOnPage()
    })

    it('shows answers for checking', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.monitoringConditionsSection().should('exist')
      page.installationAddressSection().should('exist')
      page.curfewOnDayOfReleaseSection.shouldExist()
      page.curfewSection().should('exist')
      page.curfewTimetableSection().should('exist')
      page.trailMonitoringConditionsSection().should('exist')
      page.alcoholMonitoringConditionsSection().should('exist')
    })

    it('does not show "change" links', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.changeLinks.should('not.exist')
    })

    it('shows correct buttons', () => {
      const page = Page.visit(CheckYourAnswers, { orderId: mockOrderId }, {}, pageHeading)

      page.continueButton().should('exist')
      page.continueButton().contains('Go to next section')
      page.returnButton().should('exist')
      page.returnButton().contains('Return to main form menu')
    })
  })
})
