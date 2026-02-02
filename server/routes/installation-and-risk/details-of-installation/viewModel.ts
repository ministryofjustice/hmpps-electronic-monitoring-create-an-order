import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import { DetailsOfInstallationInput } from './formModel'

type DetailsOfInstallationModel = ViewModel<Omit<DetailsOfInstallationInput, 'action'>>

const construct = (order: Order): DetailsOfInstallationModel => {
  const content = getContent('en', 'DDV6')
  return {
    errorSummary: null,
    possibleRisk: {
      values:
        order.detailsOfInstallation?.riskCategory?.filter(
          it => Object.keys(content.reference.possibleRisks).indexOf(it) !== -1,
        ) || [],
    },
    riskCategory: {
      values:
        order.detailsOfInstallation?.riskCategory?.filter(
          it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1,
        ) || [],
    },
    riskDetails: {
      value: order.detailsOfInstallation?.riskDetails || '',
    },
  }
}

export default { construct }
