import { createTextAnswer } from '../../utils/checkYourAnswers'

import { Order } from '../Order'
import AttachmentType from '../AttachmentType'

const createViewModel = (order: Order) => {
  const licence = order.additionalDocuments.find(x => x.fileType === AttachmentType.LICENCE)
  const photo = order.additionalDocuments.find(x => x.fileType === AttachmentType.PHOTO_ID)
  const answers = [
    createTextAnswer('Licence', licence?.fileName ?? 'No licence document uploaded', ''),
    createTextAnswer('Photo identification (optional)', photo?.fileName ?? 'No photo ID document uploaded', ''),
  ]
  return answers
}

export default createViewModel
