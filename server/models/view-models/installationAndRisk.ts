import { createGovukErrorSummary } from '../../utils/errors'
import { getError } from '../../utils/utils'
import { InstallationAndRiskFormData } from '../form-data/installationAndRisk'
import { InstallationAndRisk } from '../InstallationAndRisk'
import { ValidationResult } from '../Validation'
import { MultipleChoiceField, ViewModel } from './utils'
import possibleRisks from '../../i18n/en/reference/possibleRisks'
import riskCategories from '../../i18n/en/reference/riskCategories'
import { Order } from '../Order'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'

type InstallationAndRiskViewModel = ViewModel<Omit<InstallationAndRisk, 'riskCategory' | 'possibleRisk'>> & {
  riskCategory: MultipleChoiceField
  possibleRisk: MultipleChoiceField
  ddVersion5: boolean
}

const constructFromFormData = (
  formData: InstallationAndRiskFormData,
  validationErrors: ValidationResult,
  order: Order,
): InstallationAndRiskViewModel => {
  return {
    offence: {
      value: formData.offence || '',
      error: getError(validationErrors, 'offence'),
    },
    offenceAdditionalDetails: {
      value: formData.offenceAdditionalDetails || '',
      error: getError(validationErrors, 'offenceAdditionalDetails'),
    },
    possibleRisk: {
      values: formData.possibleRisk || [],
      error: getError(validationErrors, 'possibleRisk'),
    },
    riskCategory: {
      values: formData.riskCategory || [],
      error: getError(validationErrors, 'riskCategory'),
    },
    riskDetails: {
      value: formData.riskDetails || '',
      error: getError(validationErrors, 'riskDetails'),
    },
    mappaLevel: {
      value: formData.mappaLevel || '',
      error: getError(validationErrors, 'mappaLevel'),
    },
    mappaCaseType: {
      value: formData.mappaCaseType || '',
      error: getError(validationErrors, 'mappaCaseType'),
    },
    errorSummary: createGovukErrorSummary(validationErrors),
    ddVersion5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const createFromEntity = (order: Order): InstallationAndRiskViewModel => {
  const { installationAndRisk } = order
  return {
    offence: {
      value: installationAndRisk?.offence || '',
    },
    offenceAdditionalDetails: {
      value: installationAndRisk?.offenceAdditionalDetails || '',
    },
    possibleRisk: {
      values: installationAndRisk?.riskCategory?.filter(it => Object.keys(possibleRisks).indexOf(it) !== -1) || [],
    },
    riskCategory: {
      values: installationAndRisk?.riskCategory?.filter(it => Object.keys(riskCategories).indexOf(it) !== -1) || [],
    },
    riskDetails: {
      value: installationAndRisk?.riskDetails || '',
    },
    mappaLevel: {
      value: installationAndRisk?.mappaLevel || '',
    },
    mappaCaseType: {
      value: installationAndRisk?.mappaCaseType || '',
    },
    errorSummary: null,
    ddVersion5: isOrderDataDictionarySameOrAbove('DDV5', order),
  }
}

const construct = (
  order: Order,
  formData: [InstallationAndRiskFormData],
  errors: ValidationResult,
): InstallationAndRiskViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData[0], errors, order)
  }

  return createFromEntity(order)
}

export default {
  construct,
}
