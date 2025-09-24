import paths from '../../../constants/paths'
import I18n from '../../../types/i18n'
import { createAnswer } from '../../../utils/checkYourAnswers'
import { lookup } from '../../../utils/utils'
import { MonitoringConditions } from '../model'

export const createModel = (orderId: string, data: MonitoringConditions, content: I18n) => {
  const path = `${paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION}/order-type`
  return {
    answers: [
      createAnswer(
        'What is the order type?',
        lookup(content.reference.orderTypes, data.orderType),
        path.replace(':orderId', orderId),
      ),
    ],
  }
}

export default createModel
