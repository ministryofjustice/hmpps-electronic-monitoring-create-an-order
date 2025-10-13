import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'

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

  it('Page is accessible', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.checkIsAccessible()
  })

  it('Should display content', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.header.userName().should('contain.text', 'J. Smith')
    page.header.phaseBanner().should('contain.text', 'dev')

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Community' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Community SDO' },
    ])
  })

  it('Should not display order type if notifying org is prison', () => {
    stubGetOrder('PRISON')
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
    page.orderInformationSection.shouldHaveItems([
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
    ])
  })

  it('Should not display order type if notifying org is ycs', () => {
    stubGetOrder('YOUTH_CUSTODY_SERVICE')
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Detention and Training Order (DTO)')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
    page.orderInformationSection.shouldHaveItems([
      { key: 'What type of sentence has the device wearer been given?', value: 'Detention and Training Order (DTO)' },
    ])
  })

  it('Should not display order type if notifying org is home office', () => {
    stubGetOrder('HOME_OFFICE')
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.orderInformationSection.shouldExist()
    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
  })

  it('Should display content for a Post Release order', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
    ])
  })

  it('Should display content for a Bail order', () => {
    stubGetOrder('CROWN_COURT')
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Bail')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.bailTypeField.set('Bail Supervision & Support')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Bail' },
      { key: 'What type of bail has the device wearer been given?', value: 'Bail Supervision & Support' },
    ])
  })

  it('should allow the user to change their answers', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.changeLinkByQuestion('What type of sentence has the device wearer been given?').click()

    Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
  })

  it('should update the CYA page when a sentence type answer is changed', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    let sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    let cyaPage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage.changeLinkByQuestion('What type of sentence has the device wearer been given?').click()

    sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Extended Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    cyaPage = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Extended Determinate Sentence' },
    ])
  })
})
