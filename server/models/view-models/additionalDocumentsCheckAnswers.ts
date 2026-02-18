import { createAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import AttachmentType from '../AttachmentType'
import I18n from '../../types/i18n'
import paths from '../../constants/paths'
import { Attachment } from '../Attachment'
import { isNotNullOrUndefined } from '../../utils/utils'
import { notifyingOrganisationCourts } from '../NotifyingOrganisation'

const createViewModel = (order: Order, content: I18n | undefined) => {
  const licence = order.additionalDocuments.find(x => x.fileType === AttachmentType.LICENCE)
  const photo = order.additionalDocuments.find(x => x.fileType === AttachmentType.PHOTO_ID)
  const courtOrder = order.additionalDocuments.find(x => x.fileType === AttachmentType.COURT_ORDER)
  const grantOfBail = order.additionalDocuments.find(x => x.fileType === AttachmentType.GRANT_OF_BAIL)
  const answerOpts = { ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR' }
  const answers = []

  if (order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE') {
    answers.push(
      createAnswer(
        content?.pages.haveGrantOfBail.questions.haveGrantOfBail.text || '',
        order.orderParameters?.haveGrantOfBail ? 'Yes' : 'No',
        paths.ATTACHMENT.HAVE_GRANT_OF_BAIL.replace(':orderId', order.id),
        answerOpts,
      ),
    )
    if (order.orderParameters?.haveGrantOfBail) {
      answers.push(
        createAttachmentAnswer(
          grantOfBail,
          content?.pages.uploadGrantOfBail.questions.file.text || '',
          paths.ATTACHMENT.FILE_VIEW.replace(
            ':fileType(photo_Id|licence|court_order|grant_of_bail)',
            'grant_of_bail',
          ).replace(':orderId', order.id),
          order,
        ),
      )
    }
  } else if (
    isNotNullOrUndefined(order.interestedParties?.notifyingOrganisation) &&
    (notifyingOrganisationCourts as readonly string[]).includes(order.interestedParties?.notifyingOrganisation)
  ) {
    answers.push(
      createAnswer(
        content?.pages.haveCourtOrder.questions.haveCourtOrder.text || '',
        order.orderParameters?.haveCourtOrder ? 'Yes' : 'No',
        paths.ATTACHMENT.HAVE_COURT_ORDER.replace(':orderId', order.id),
        answerOpts,
      ),
    )

    if (order.orderParameters?.haveCourtOrder) {
      answers.push(
        createAttachmentAnswer(
          courtOrder,
          content?.pages.uploadCourtOrder.questions.file.text || '',
          paths.ATTACHMENT.FILE_VIEW.replace(
            ':fileType(photo_Id|licence|court_order|grant_of_bail)',
            'court_order',
          ).replace(':orderId', order.id),
          order,
        ),
      )
    }
  } else {
    answers.push(
      createAttachmentAnswer(
        licence,
        content?.pages.uploadLicense.questions.file.text || '',
        paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence|court_order|grant_of_bail)', 'licence').replace(
          ':orderId',
          order.id,
        ),
        order,
      ),
    )
  }

  answers.push(
    createAnswer(
      content?.pages.havePhoto.questions.havePhoto.text || '',
      order.orderParameters?.havePhoto ? 'Yes' : 'No',
      paths.ATTACHMENT.HAVE_PHOTO.replace(':orderId', order.id),
      answerOpts,
    ),
  )

  if (order.orderParameters?.havePhoto) {
    answers.push(
      createAttachmentAnswer(
        photo,
        content?.pages.uploadPhotoId.questions.file.text || '',
        paths.ATTACHMENT.FILE_VIEW.replace(':fileType(photo_Id|licence|court_order|grant_of_bail)', 'photo_Id').replace(
          ':orderId',
          order.id,
        ),
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
    ignoreActions: order.status === 'SUBMITTED' || order.status === 'ERROR',
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
