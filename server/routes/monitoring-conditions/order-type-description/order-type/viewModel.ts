import { NotifyingOrganisation } from '../../../../models/NotifyingOrganisation'
import { ValidationResult } from '../../../../models/Validation'
import { ViewModel } from '../../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../../utils/errors'
import { getError } from '../../../../utils/utils'
import { MonitoringConditions } from '../model'

export type OrderTypeModel = ViewModel<Pick<MonitoringConditions, 'orderType'>> & {
  orderTypeQuestions: OrderTypeQuestion[]
}

type OrderTypeQuestion = {
  question: string
  hint: string
  value: string
}

const contructModel = (
  notifyingOrg: NotifyingOrganisation,
  data: MonitoringConditions,
  errors: ValidationResult,
): OrderTypeModel => {
  const model: OrderTypeModel = {
    orderType: { value: data.orderType || '' },
    orderTypeQuestions: [],
    errorSummary: null,
  }

  model.orderTypeQuestions = getQuestions(notifyingOrg)

  if (errors && errors.length) {
    model.orderType!.error = getError(errors, 'orderType')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

const getQuestions = (notifyingOrg: NotifyingOrganisation) => {
  switch (notifyingOrg) {
    case 'PROBATION':
      return [
        {
          question: 'Release from prison',
          hint: 'Monitoring is a condition of being released from prison following a custodial sentence.',
          value: 'POST_RELEASE',
        },
        {
          question: 'Community',
          hint: 'Monitoring is a condition of a court order where they were convicted of a crime, but received a community rather than custodial sentence.',
          value: 'COMMUNITY',
        },
      ]
    case 'CIVIL_COUNTY_COURT':
    case 'CROWN_COURT':
    case 'FAMILY_COURT':
    case 'YOUTH_COURT':
    case 'MILITARY_COURT':
    case 'SCOTTISH_COURT':
    case 'MAGISTRATES_COURT':
      return [
        {
          question: 'Community',
          hint: 'Monitoring is a condition of a court order where they were convicted of a crime, but received a community rather than custodial sentence.',
          value: 'COMMUNITY',
        },
        {
          question: 'Bail',
          hint: 'Monitoring is a condition of bail.',
          value: 'BAIL',
        },
        {
          question: 'Civil',
          hint: 'Monitoring is a condition of a civil court order, rather than a criminal one.',
          value: 'CIVIL',
        },
      ]
    default:
      return []
  }
}

export default contructModel
