import { v4 as uuidv4 } from 'uuid'
import fillInNewOrder from '../../../utils/scenario-flows/fillInNewOrder.cy'
import { stubAttachments } from '../../utils'
import Page from '../../../pages/page'
import OrderSummaryPage from '../../../pages/order/summary'
import ConfirmVariationPage from '../../../pages/order/variation/confirmVariation'
import IsRejectionPage from '../../../e2e/order/edit-order/is-rejection/isRejectionPage'
import fillInInterestedPartiesWith from '../../../utils/scenario-flows/interested-parties.cy'
import InterestedPartiesCheckYourAnswersPage from '../../../e2e/order/interested-parties/check-your-answers/interestedPartiesCheckYourAnswersPage'

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

    stubAttachments(files, fmsCaseId, hmppsDocumentId, true)
    cy.signIn()
  })

  afterEach(() => {
    cy.task('resetFeatureFlags')
  })

  // skipped as it should not see interested parties section by ELM-4807
  it.skip('Order start date is in the past', () => {
    fillInNewOrder({
      startDate: new Date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
      files,
    })
    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    Page.verifyOnPage(IsRejectionPage).isNotRejection()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()

    let cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.changeLinkByQuestion('What organisation or related organisation are you part of?').click()

    fillInInterestedPartiesWith({
      continueOnCya: false,
    })
    cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: 'What organisation or related organisation are you part of?', value: 'Prison service' },
      { key: 'Select the name of the Prison', value: 'Altcourse Prison' },
      { key: "What is your team's contact email address?", value: 'a@b.com' },
    ])
  })

  it('Order start date is in the future', () => {
    fillInNewOrder({
      startDate: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).setHours(0, 0, 0, 0)),
      files,
      newDeviceWearerFlow: true,
    })
    Page.verifyOnPage(OrderSummaryPage).makeChanges()
    Page.verifyOnPage(ConfirmVariationPage).confirm()
    Page.verifyOnPage(IsRejectionPage).isNotRejection()

    const orderSummaryPage = Page.verifyOnPage(OrderSummaryPage)

    orderSummaryPage.interestedPartiesTask.click()

    // only clears data down if notifying org has changes so can't re-fill this in
    // const input = {
    //   responsibleOfficer: {
    //     firstName: 'John',
    //     lastName: 'Smith',
    //     email: 'John@Smith.com',
    //   },
    //   responsibleOrganisation: {
    //     responsibleOrganisation: 'Probation',
    //     probationRegion: 'Wales',
    //   },
    //   pdu: 'Swansea',
    // }
    // fillInInterestedPartiesWith({
    //   continueOnCya: false,
    //   ...input,
    // })
    //
    const cyaPage = Page.verifyOnPage(InterestedPartiesCheckYourAnswersPage)
    cyaPage.organisationDetailsSection.shouldHaveItems([
      { key: "What is the Responsible Officer's first name?", value: '' },
      { key: "What is the Responsible Officer's last name?", value: '' },
      { key: "What is the Responsible Officer's email address?", value: '' },
      { key: "What is the Responsible Officer's organisation?", value: '' },
    ])
  })
})
