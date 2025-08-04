import PhotoQuestionPage from '../../../pages/order/attachments/photoQuestion'
import Page from '../../../pages/page'

context('Attachments', () => {
  context('Photo Question', () => {
    context('when viewing a draft order', () => {
      it('should render the photo question page', () => {
        const page = Page.visit(PhotoQuestionPage)

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.photoQuestionField.shouldNotBeDisabled()

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')
      })
    })
  })
})
