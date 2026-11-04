import { v4 as uuidv4 } from 'uuid'
import HavePhotoPage from '../../../pages/order/attachments/havePhoto'
import Page from '../../../pages/page'
import OrderTasksPage from '../../../pages/order/summary'

const mockOrderId = uuidv4()
const mockOrderId2 = uuidv4()

context('Attachments', () => {
  context('Have Photo', () => {
    context('when viewing a draft order', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', { name: 'john smith', roles: ['ROLE_EM_CEMO__CREATE_ORDER'] })
        cy.task('stubCemoListOrders')
        cy.task('stubCemoGetOrder', { httpStatus: 200, id: mockOrderId, status: 'IN_PROGRESS' })
        cy.signIn()
      })
      it('should render the have photo page', () => {
        const page = Page.visit(HavePhotoPage, { orderId: mockOrderId })

        page.header.userName().should('contain.text', 'J. Smith')
        page.header.phaseBanner().should('contain.text', 'dev')

        page.form.havePhotoField.shouldNotBeDisabled()
        page.form.havePhotoField.element.contains(
          'We need a photo to help identify the device wearer if there is not one on the licence.',
        )
        page.form.havePhotoField.shouldHaveOption('Yes')
        page.form.havePhotoField.shouldHaveOption('No')

        page.form.saveAndContinueButton.should('exist')
        page.form.saveAsDraftButton.should('exist')

        page.checkIsAccessible()
      })
    })

    context('when user cohort is court', () => {
      beforeEach(() => {
        cy.task('reset')
        cy.task('stubSignIn', {
          name: 'john smith',
          roles: ['ROLE_EM_CEMO__CREATE_ORDER'],
          stubCohort: false,
          userId: '123',
        })

        cy.task('stubCemoRequest', {
          httpStatus: 200,
          method: 'GET',
          subPath: 'user-cohort',
          response: { cohort: 'COURT' },
        })

        cy.task('stubCemoListOrders')

        cy.task('stubCemoGetOrder', {
          httpStatus: 200,
          id: mockOrderId2,
          status: 'IN_PROGRESS',
          order: {
            interestedParties: {
              notifyingOrganisation: 'FAMILY_COURT',
              notifyingOrganisationName: '',
              notifyingOrganisationEmail: '',
              responsibleOfficerName: '',
              responsibleOfficerPhoneNumber: '',
              responsibleOrganisation: 'FIELD_MONITORING_SERVICE',
              responsibleOrganisationAddress: {
                addressType: 'RESPONSIBLE_ORGANISATION',
                addressLine1: '',
                addressLine2: '',
                addressLine3: '',
                addressLine4: '',
                postcode: '',
              },
              responsibleOrganisationEmail: '',
              responsibleOrganisationPhoneNumber: '',
              responsibleOrganisationRegion: '',
            },
          },
        })

        cy.signIn()
      })

      it('does not show do you have court order page, shows have photo instead', () => {
        const taskListPage = Page.visit(OrderTasksPage, { orderId: mockOrderId2 })

        taskListPage.additionalDocumentsTask.link.click()

        const havePhotoPage = Page.verifyOnPage(HavePhotoPage, { orderId: mockOrderId2 })

        havePhotoPage.header.userName().should('contain.text', 'J. Smith')
        havePhotoPage.header.phaseBanner().should('contain.text', 'dev')

        havePhotoPage.form.havePhotoField.shouldNotBeDisabled()
        havePhotoPage.form.havePhotoField.element.contains(
          'We need a photo to help identify the device wearer if there is not one on the licence.',
        )
        havePhotoPage.form.havePhotoField.shouldHaveOption('Yes')
        havePhotoPage.form.havePhotoField.shouldHaveOption('No')

        havePhotoPage.form.saveAndContinueButton.should('exist')
        havePhotoPage.form.saveAsDraftButton.should('exist')

        havePhotoPage.checkIsAccessible()
      })
    })
  })
})
