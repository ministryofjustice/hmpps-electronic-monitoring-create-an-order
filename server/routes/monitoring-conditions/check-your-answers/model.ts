import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import I18n from '../../../types/i18n'
import { createAnswer } from '../../../utils/checkYourAnswers'
import { lookup } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export const createModel = (order: Order, data: MonitoringConditions, content: I18n) => {
  const answers = []

  const nofityingOrg = order.interestedParties?.notifyingOrganisation
  if (!(nofityingOrg === 'PRISON' || nofityingOrg === 'YOUTH_CUSTODY_SERVICE' || nofityingOrg === 'HOME_OFFICE')) {
    const path = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.ORDER_TYPE
    answers.push(
      createAnswer(
        'What is the order type?',
        lookup(content.reference.orderTypes, data.orderType),
        path.replace(':orderId', order.id),
      ),
    )
  }

  if (data.sentenceType) {
    const question =
      data.orderType === 'BAIL'
        ? 'What type of bail has the device wearer been given?'
        : 'What type of sentence has the device wearer been given?'

    const path = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.SENTENCE_TYPE
    answers.push(
      createAnswer(
        question,
        lookup(content.reference.sentenceTypes, data.sentenceType),
        path.replace(':orderId', order.id),
      ),
    )
  }

  if (data.hdc !== undefined) {
    const hdcPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.HDC
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.hdc.text,
        lookup(content.reference.yesNoUnknown, data.hdc),
        hdcPath.replace(':orderId', order.id),
      ),
    )
  }

  if (data.pilot !== undefined) {
    const pilotPath = paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION.PILOT
    answers.push(
      createAnswer(
        content.pages.monitoringConditions.questions.pilot.text,
        lookup(content.reference.pilots, data.pilot),
        pilotPath.replace(':orderId', order.id),
      ),
    )
  }

  return {
    answers,
  }
}

export default createModel
