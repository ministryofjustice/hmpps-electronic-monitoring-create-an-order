import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'

const mockOrderId = uuidv4()

const stubGetOrder = (notifyingOrg: string = 'PROBATION') => {
  cy.task('stubCemoGetOrder', {
    httpStatus: 200,
    id: mockOrderId,
    order: {
      interestedParties: {
        notifyingOrganisation: notifyingOrg,
        notifyingOrganisationName: '',
        notifyingOrganisationEmail: '',
        responsibleOfficerName: '',
        responsibleOfficerPhoneNumber: '',
        responsibleOrganisation: 'HOME_OFFICE',
        responsibleOrganisationRegion: '',
        responsibleOrganisationEmail: '',
      },
    },
  })
}

context('Check your answers', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
    stubGetOrder()
    cy.signIn()
  })

  const pageHeading = 'Check your answers'

  it('Page accessisble', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.orderTypeField.set('Community')
    orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.orderTypeField.set('Community')
    orderTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldHaveItems([{ key: 'What is the order type?', value: 'Community' }])
  })

  it('Should not display order type if notifying org is prison', () => {
    stubGetOrder('PRISON')

    Page.visit(OrderTypePage, { orderId: mockOrderId })

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
  })

  it('Should not display order type if notifying org is ycs', () => {
    stubGetOrder('YOUTH_CUSTODY_SERVICE')

    Page.visit(OrderTypePage, { orderId: mockOrderId })

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
  })

  it('Should not display order type if notifying org is home office', () => {
    stubGetOrder('HOME_OFFICE')

    Page.visit(OrderTypePage, { orderId: mockOrderId })

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
  })
})
