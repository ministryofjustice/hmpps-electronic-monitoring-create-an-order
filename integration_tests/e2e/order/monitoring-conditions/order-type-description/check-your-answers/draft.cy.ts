import { v4 as uuidv4 } from 'uuid'
import CheckYourAnswersPage from './CheckYourAnswersPage'
import Page from '../../../../../pages/page'
import OrderTypePage from '../order-type/OrderTypePage'
import SentenceTypePage from '../sentence-type/SentenceTypePage'
import HdcPage from '../hdc/hdcPage'

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
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Post Release' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
      { key: 'Is the device wearer on a Home Detention Curfew (HDC)?', value: 'No' },
    ])
  })

  it('Should display content for a Community order', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Community')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Supervision Default Order')
    sentenceTypePage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldHaveItems([
      { key: 'What is the order type?', value: 'Community' },
      { key: 'What type of sentence has the device wearer been given?', value: 'Supervision Default Order' },
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

  it('Should not display order type if notifying org is prison', () => {
    stubGetOrder('PRISON')
    Page.visit(OrderTypePage, { orderId: mockOrderId })
    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('Yes')
    hdcPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)

    page.orderInformationSection.shouldNotHaveItem('What is the order type?')
    page.orderInformationSection.shouldHaveItems([
      { key: 'What type of sentence has the device wearer been given?', value: 'Standard Determinate Sentence' },
      { key: 'Is the device wearer on a Home Detention Curfew (HDC)?', value: 'Yes' },
    ])
  })

  it('should allow the user to change their answers', () => {
    const orderTypePage = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage.form.fillInWith('Release from prison')
    orderTypePage.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const page = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    page.changeLinkByQuestion('What type of sentence has the device wearer been given?').click()

    Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
  })

  it('should clear dependent answers when a previous answer is changed', () => {
    const orderTypePage1 = Page.visit(OrderTypePage, { orderId: mockOrderId })
    orderTypePage1.form.fillInWith('Release from prison')
    orderTypePage1.form.continueButton.click()

    const sentenceTypePage = Page.verifyOnPage(SentenceTypePage, { orderId: mockOrderId })
    sentenceTypePage.form.fillInWith('Standard Determinate Sentence')
    sentenceTypePage.form.continueButton.click()

    const hdcPage = Page.verifyOnPage(HdcPage, { orderId: mockOrderId })
    hdcPage.form.fillInWith('No')
    hdcPage.form.continueButton.click()

    const cyaPage1 = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage1.changeLinkByQuestion('What is the order type?').click()

    stubGetOrder('HOME_OFFICE')
    Page.visit(OrderTypePage, { orderId: mockOrderId })

    const cyaPage2 = Page.verifyOnPage(CheckYourAnswersPage, { orderId: mockOrderId }, {}, pageHeading)
    cyaPage2.orderInformationSection.shouldNotHaveItem('What type of sentence has the device wearer been given?')
    cyaPage2.orderInformationSection.shouldNotHaveItem('What is the order type?')
    cyaPage2.orderInformationSection.shouldNotHaveItem('Is the device wearer on a Home Detention Curfew (HDC)?')
  })
})
