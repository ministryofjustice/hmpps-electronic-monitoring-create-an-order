import { v4 as uuidv4 } from 'uuid'
import fillInNewOrder from '../../../utils/scenario-flows/fillInNewOrder.cy'
import { stubAttachments } from '../../utils'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'
import NotifyingOrganisationPage from '../../../e2e/order/interested-parties/notifying-organisation/notifyingOrganisationPage'
import type { ScenarioOrderVersion } from '../../../mockApis/cemo'

context('Interested parties flow', () => {
  const fmsCaseId: string = uuidv4()
  const hmppsDocumentId: string = uuidv4()
  const files = {
    licence: {
      contents: 'cypress/fixtures/test.pdf',
      fileName: 'test.pdf',
    },
  }

  beforeEach(() => {
    cy.task('resetDB')
    cy.task('reset')

    cy.task('stubSignIn', {
      name: 'Cemor Stubs',
      roles: ['ROLE_EM_CEMO__CREATE_ORDER', 'PRISON_USER', 'ROLE_PRISON'],
    })

    cy.task('stubFMSCreateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSCreateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    cy.task('stubFMSUpdateDeviceWearer', {
      httpStatus: 200,
      response: { result: [{ id: fmsCaseId, message: '' }] },
    })

    cy.task('stubFMSUpdateMonitoringOrder', {
      httpStatus: 200,
      response: { result: [{ id: uuidv4(), message: '' }] },
    })

    cy.task('stubFMSGetCaseState', {
      httpStatus: 200,
      caseId: fmsCaseId,
      state: '11',
    })

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Order start date is in the future', () => {
    fillInNewOrder({
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
      files,
      newDeviceWearerFlow: true,
    })
    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()

    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: "What is the Responsible Officer's first name?", value: '' },
      { key: "What is the Responsible Officer's last name?", value: '' },
      { key: "What is the Responsible Officer's email address?", value: '' },
      { key: "What is the Responsible Officer's organisation?", value: '' },
    ])
  })

  it('amends a submitted request with a rejected FMS outcome', () => {
    cy.task('stubFMSGetCaseState', {
      httpStatus: 200,
      caseId: fmsCaseId,
      state: '7',
    })
    cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: true })
    cy.signIn()
    fillInNewOrder({ files, newDeviceWearerFlow: true })

    cy.location('pathname').then(pathname => {
      const orderId = pathname.split('/')[2]

      cy.task<ScenarioOrderVersion[]>('getScenarioOrderVersions', { orderId }).then(versionsBefore => {
        expect(versionsBefore).to.have.length(1)
        expect(versionsBefore[0].status).to.equal('SUBMITTED')
        expect(versionsBefore[0].type).to.equal('REQUEST')
        expect(versionsBefore[0].fmsResultId).not.to.equal(null)

        cy.visit(`/order/${orderId}/summary`)
        Page.verifyOnPage(OrderSummaryPage).makeChanges()
        Page.verifyOnPage(ConfirmVariationPage).confirm()
        Page.verifyOnPage(NotifyingOrganisationPage)

        cy.task<ScenarioOrderVersion[]>('getScenarioOrderVersions', { orderId }).then(versionsAfter => {
          expect(versionsAfter).to.have.length(versionsBefore.length + 1)
          expect(versionsAfter[0]).to.deep.equal(versionsBefore[0])
          const replacement = versionsAfter[versionsAfter.length - 1]
          expect(replacement.type).to.equal('AMEND_ORIGINAL_REQUEST')
          expect(replacement.status).to.equal('IN_PROGRESS')
        })
      })
    })
  })
  ;(['REQUEST', 'VARIATION'] as const).forEach(sourceType => {
    ;[false, true].forEach(rejectedMarker => {
      it(`uses the correct replacement family for a ${sourceType} returned order with ${rejectedMarker ? 'a historical REJECTED marker' : 'REJECTED lifecycle status'}`, () => {
        cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: false })
        cy.signIn()
        fillInNewOrder({ files, newDeviceWearerFlow: true })

        cy.location('pathname').then(pathname => {
          const orderId = pathname.split('/')[2]
          cy.task('setScenarioOrderVersion', {
            orderId,
            status: rejectedMarker ? 'SUBMITTED' : 'REJECTED',
            type: sourceType,
          })

          if (rejectedMarker) {
            cy.visit(`/order/${orderId}/summary`)
            Page.verifyOnPage(OrderSummaryPage).makeChanges()
            Page.verifyOnPage(ConfirmVariationPage).confirm()
            Page.verifyOnPage(OrderSummaryPage)
            cy.task('setScenarioOrderVersion', {
              orderId,
              status: 'REJECTED',
              type: 'REJECTED',
            })
          }

          cy.task('setFeatureFlags', { SERVICE_REQUEST_TYPE_ENABLED: rejectedMarker })
          cy.task<ScenarioOrderVersion[]>('getScenarioOrderVersions', { orderId }).then(versionsBefore => {
            const rejectedVersion = versionsBefore[versionsBefore.length - 1]
            expect(rejectedVersion.status).to.equal('REJECTED')
            expect(rejectedVersion.type).to.equal(rejectedMarker ? 'REJECTED' : sourceType)
            expect(versionsBefore[0].fmsResultId).not.to.equal(null)

            cy.visit(`/order/${orderId}/summary`)
            Page.verifyOnPage(OrderSummaryPage).makeChanges()
            Page.verifyOnPage(ConfirmVariationPage).confirm()
            Page.verifyOnPage(NotifyingOrganisationPage)

            cy.task<ScenarioOrderVersion[]>('getScenarioOrderVersions', { orderId }).then(versionsAfter => {
              expect(versionsAfter).to.have.length(versionsBefore.length + 1)
              expect(versionsAfter.slice(0, -1)).to.deep.equal(versionsBefore)
              const replacement = versionsAfter[versionsAfter.length - 1]
              expect(replacement.id).not.to.equal(rejectedVersion.id)
              expect(replacement.versionId).to.equal(rejectedVersion.versionId + 1)
              expect(replacement.status).to.equal('IN_PROGRESS')
              const expectedType = sourceType === 'VARIATION' ? 'VARIATION' : 'AMEND_ORIGINAL_REQUEST'
              expect(replacement.type).to.equal(expectedType)
              expect(replacement.fmsResultId).to.equal(null)
            })
          })
        })
      })
    })
  })
})
