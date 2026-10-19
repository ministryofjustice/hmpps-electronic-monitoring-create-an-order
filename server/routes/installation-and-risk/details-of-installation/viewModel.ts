import { DataDictionaryVersion, Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import { createGovukErrorSummary } from '../../../utils/errors'
import splitRisks from '../splitRisks'
import { getError } from '../../../utils/utils'
import { DetailsOfInstallationInput } from './formModel'

type DetailsOfInstallationModel = ViewModel<Omit<DetailsOfInstallationInput, 'action'>>

const construct = (
  order: Order,
  formData: DetailsOfInstallationInput | undefined,
  errors: ValidationResult,
): DetailsOfInstallationModel => {
  const version = order.dataDictionaryVersion

  return {
    possibleRisk: {
      values: getPossibleRiskValues(formData?.possibleRisk, order.detailsOfInstallation?.riskCategory, version),
      error: getError(errors, 'possibleRisk'),
    },
    riskCategory: {
      values: getRiskCategoryValues(formData?.riskCategory, order.detailsOfInstallation?.riskCategory, version),
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
  version: DataDictionaryVersion,
): string[] => {
  const source = formValues && formValues.length ? formValues : orderValues
  return splitRisks(source, version).possibleRisk
}

const getRiskCategoryValues = (
  formValues: string[] | undefined,
  orderValues: string[] | null | undefined,
  version: DataDictionaryVersion,
): string[] => {
  const source = formValues && formValues.length ? formValues : orderValues
  return splitRisks(source, version).riskCategory
}

export default { construct }
