import { createAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import AttachmentType from '../AttachmentType'
import I18n from '../../types/i18n'
import paths from '../../constants/paths'
import { Attachment } from '../Attachment'

const createViewModel = (order: Order, content: I18n | undefined) => {
  const licence = order.additionalDocuments.find(x => x.fileType === AttachmentType.LICENCE)
  const photo = order.additionalDocuments.find(x => x.fileType === AttachmentType.PHOTO_ID)
  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR' }
  const answers = [
    createAttachmentAnswer(
      licence,
      content?.pages.uploadLicense.questions.file.text || '',
      paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence)', 'licence').replace(':orderId', order.id),
      order,
    ),
    createAnswer(
      content?.pages.havePhoto.questions.havePhoto.text || '',
      order.orderParameters?.havePhoto ? 'Yes' : 'No',
      paths.ATTACHMENT.HAVE_PHOTO.replace(':orderId', order.id),
      answerOpts,
    ),
  ]

  if (order.orderParameters?.havePhoto) {
    answers.push(
      createAttachmentAnswer(
        photo,
        content?.pages.uploadPhotoId.questions.file.text || '',
        paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence)', 'photo_Id').replace(':orderId', order.id),
        order,
      ),
    )
  }
  return answers
}

export default createViewModel

function createAttachmentAnswer(attachment: Attachment | undefined, text: string, uri: string, order: Order) {
  return createAnswer(text, createFileNameLink(attachment, order.id), uri, {
    valueType: 'html',
    ignoreActions: order.status === 'SUBMITTED',
  })
}

function createFileNameLink(attachment: Attachment | undefined, orderId: string) {
  if (!attachment) {
    return ''
  }
  const { fileName, fileType } = attachment
  const fileTypeString = fileType === AttachmentType.LICENCE ? 'licence' : 'photo_Id'
  return `<a href="/order/${orderId}/attachments/${fileTypeString}/${fileName}" class="govuk-link">${fileName}</a>`
}
