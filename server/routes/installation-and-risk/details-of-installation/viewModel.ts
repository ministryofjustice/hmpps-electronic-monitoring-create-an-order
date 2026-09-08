import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { TextField, ViewModel } from '../../../models/view-models/utils'
import { getRiskInformationFlow } from '../../../services/riskInformationFlow'
import I18n from '../../../types/i18n'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { DetailsOfInstallationInput } from './formModel'

type DetailsOfInstallationModel = ViewModel<Omit<DetailsOfInstallationInput, 'action'>> & {
  offence?: TextField
}

const construct = (
  order: Order,
  formData: DetailsOfInstallationInput | undefined,
  errors: ValidationResult,
): DetailsOfInstallationModel => {
  const content = getContent('en', order.dataDictionaryVersion)
  const offencePolicy = getRiskInformationFlow(order.interestedParties?.notifyingOrganisation).offence

  return {
    offence: offencePolicy.mode === 'FIXED' ? { value: offencePolicy.offenceType } : undefined,
    possibleRisk: {
      values: getPossibleRiskValues(formData?.possibleRisk, order.detailsOfInstallation?.riskCategory, content),
      error: getError(errors, 'possibleRisk'),
    },
    riskCategory: {
      values: getRiskCategoryValues(formData?.riskCategory, order.detailsOfInstallation?.riskCategory, content),
    },
    riskDetails: {
      value: formData?.riskDetails || order.detailsOfInstallation?.riskDetails || '',
      error: getError(errors, 'riskDetails'),
    },
    genderRiskDetails: {
      value: formData?.genderRiskDetails || order.detailsOfInstallation?.genderRiskDetails || '',
      error: getError(errors, 'genderRiskDetails'),
    },
    errorSummary: createGovukErrorSummary(errors),
  }
}

const getPossibleRiskValues = (
  formValues: string[] | undefined,
  orderValues: string[] | null | undefined,
  content: I18n,
): string[] => {
  if (formValues && formValues.length) {
    return formValues.filter(it => Object.keys(content.reference.possibleRisks).indexOf(it) !== -1)
  }
  return orderValues?.filter(it => Object.keys(content.reference.possibleRisks).indexOf(it) !== -1) || []
}

const getRiskCategoryValues = (
  formValues: string[] | undefined,
  orderValues: string[] | null | undefined,
  content: I18n,
): string[] => {
  if (formValues && formValues.length) {
    return formValues.filter(it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1)
  }
  return orderValues?.filter(it => Object.keys(content.reference.riskCategories).indexOf(it) !== -1) || []
}

export default { construct }
