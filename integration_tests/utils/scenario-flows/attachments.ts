import Page from '../../pages/page'
import AttachmentSummaryPage from '../../pages/order/attachments/summary'
import UploadPhotoIdPage from '../../pages/order/attachments/uploadPhotoId'
import UploadLicencePage from '../../pages/order/attachments/uploadLicence'
import HavePhotoPage from '../../pages/order/attachments/havePhoto'
import HaveCourtOrderPage from '../../e2e/order/attachments/have-court-order/courtOrderDocumentPage'
import UploadCourtOrderPage from '../../e2e/order/attachments/upload-court-order/uploadCourtOrderPage'

export default function fillInAttachmentDetailsWith({ files }): void {
  if (files.licence !== undefined) {
    const uploadLicencePage = Page.verifyOnPage(UploadLicencePage)
    uploadLicencePage.form.fillInWith({
      file: files.licence,
    })
    uploadLicencePage.form.saveAndContinueButton.click()
  }

  if (files.courtOrder !== undefined) {
    const haveCourtOrderPage = Page.verifyOnPage(HaveCourtOrderPage)
    haveCourtOrderPage.form.fillInWith(files.courtOrder.fileRequired)
    haveCourtOrderPage.form.saveAndContinueButton.click()

    if (files.courtOrder.fileRequired === 'Yes') {
      const uploadCourtOrderPage = Page.verifyOnPage(UploadCourtOrderPage)
      uploadCourtOrderPage.form.fillInWith({
        file: files.courtOrder,
      })
      uploadCourtOrderPage.form.saveAndContinueButton.click()
    }
  }

  if (files && files.photoId !== undefined) {
    const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
    havePhotoPage.form.havePhotoField.set('Yes')
    havePhotoPage.form.saveAndContinueButton.click()

    const uploadPhotoIdPage = Page.verifyOnPage(UploadPhotoIdPage)
    uploadPhotoIdPage.form.fillInWith({
      file: files.photoId,
    })
    uploadPhotoIdPage.form.saveAndContinueButton.click()
  } else {
    const havePhotoPage = Page.verifyOnPage(HavePhotoPage)
    havePhotoPage.form.havePhotoField.set('No')
    havePhotoPage.form.saveAndContinueButton.click()
  }

  const attachmentPage = Page.verifyOnPage(AttachmentSummaryPage)

  attachmentPage.backToSummaryButton.click()
}
