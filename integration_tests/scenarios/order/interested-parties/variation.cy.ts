import { v4 as uuidv4 } from 'uuid'
import fillInNewOrder from '../../../utils/scenario-flows/fillInNewOrder.cy'
import { stubAttachments } from '../../utils'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import IsRejectionPage from '../../../e2e/order/edit-order/is-rejection/isRejectionPage'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'

context('Interested parties flow', () => {
  const testFlags = { INTERESTED_PARTIES_FLOW_ENABLED: true }
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

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)
    cy.signIn()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  it('Order start date is in the past', () => {
    fillInNewOrder({
      startDate: new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
      files,
    })
    cy.task('setFeatureFlags', testFlags)
    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    Page.verifyOnPage(IsRejectionPage).isNotRejection()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      },
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
  })

  it('Order start date is in the future', () => {
    fillInNewOrder({
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
      files,
    })
    cy.task('setFeatureFlags', testFlags)
    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    Page.verifyOnPage(IsRejectionPage).isNotRejection()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()
    const input = {
      notifyingOrganisation: {
        notifyingOrganisation: 'Prison service',
        notifyingOrganisationEmailAddress: 'a@b.com',
        prison: 'Altcourse Prison',
      },
      responsibleOfficer: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'John@Smith.com',
      }
      responsibleOrganisation: {
        responsibleOrganisation: 'Probation',
        probationRegion: 'Wales',
      },
      pdu: 'mock',
    }
    fillInInterestedPartiesWith({
      continueOnCya: false,
      ...input,
    })
  })
})
