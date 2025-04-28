import { createAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import AttachmentType from '../AttachmentType'

const createViewModel = (order: Order) => {
  const licence = order.additionalDocuments.find(x => x.fileType === AttachmentType.LICENCE)
  const photo = order.additionalDocuments.find(x => x.fileType === AttachmentType.PHOTO_ID)
  const answers = [
    createAnswer('Licence', licence?.fileName ?? 'No licence document uploaded', ''),
    createAnswer('Photo identification (optional)', photo?.fileName ?? 'No photo ID document uploaded', ''),
  ]
  return answers
}

export default createViewModel
