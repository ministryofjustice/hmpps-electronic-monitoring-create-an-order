import getContent from '../../../i18n'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError } from '../../../utils/utils'
import { DetailsOfInstallationInput } from './formModel'
import { splitRiskDetails } from '../../../models/DetailsOfInstallation'

type DetailsOfInstallationModel = ViewModel<Omit<DetailsOfInstallationInput, 'action'>>

const construct = (
  order: Order,
  formData: DetailsOfInstallationInput | undefined,
  errors: ValidationResult,
): DetailsOfInstallationModel => {
  const content = getContent('en', order.dataDictionaryVersion)
  const storedRiskDetails = splitRiskDetails(order.detailsOfInstallation?.riskDetails)
  const storedGenderRiskDetails = order.detailsOfInstallation?.genderRiskDetails || storedRiskDetails.genderRiskDetails
  return {
    possibleRisk: {
      values: getPossibleRiskValues(formData?.possibleRisk, order.detailsOfInstallation?.riskCategory, content),
      error: getError(errors, 'possibleRisk'),
    },
    riskCategory: {
      values: getRiskCategoryValues(formData?.riskCategory, order.detailsOfInstallation?.riskCategory, content),
    },
    riskDetails: {
      value: formData?.riskDetails || storedRiskDetails.riskDetails || '',
      error: getError(errors, 'riskDetails'),
    },
    genderRiskDetails: {
      value: formData?.genderRiskDetails || storedGenderRiskDetails || '',
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
