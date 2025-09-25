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
    const path = `${paths.MONITORING_CONDITIONS.ORDER_TYPE_DESCRIPTION}/order-type`
    answers.push(
      createAnswer(
        'What is the order type?',
        lookup(content.reference.orderTypes, data.orderType),
        path.replace(':orderId', order.id),
      ),
    )
  }

  return {
    answers,
  }
}

export default createModel
