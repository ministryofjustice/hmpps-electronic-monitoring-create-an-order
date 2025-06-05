import { createGovukErrorSummary } from '../../utils/errors'
import FeatureFlags from '../../utils/featureFlags'
import { getError } from '../../utils/utils'
import { InstallationAndRiskFormData } from '../form-data/installationAndRisk'
import { InstallationAndRisk } from '../InstallationAndRisk'
import { ValidationResult } from '../Validation'
import { MultipleChoiceField, ViewModel } from './utils'

type InstallationAndRiskViewModel = ViewModel<Omit<InstallationAndRisk, 'riskCategory'>> & {
  riskCategory: MultipleChoiceField
  mappaEnabled: boolean
  ddVersion5: boolean
}

const constructFromFormData = (
  formData: InstallationAndRiskFormData,
  validationErrors: ValidationResult,
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
    mappaEnabled: FeatureFlags.getInstance().get('MAPPA_ENABLED'),
    ddVersion5: FeatureFlags.getInstance().get('DD_V5_1_ENABLED'),
  }
}

const createFromEntity = (installationAndRisk: InstallationAndRisk | null): InstallationAndRiskViewModel => {
  return {
    offence: {
      value: installationAndRisk?.offence || '',
    },
    offenceAdditionalDetails: {
      value: installationAndRisk?.offenceAdditionalDetails || '',
    },
    riskCategory: {
      values: installationAndRisk?.riskCategory || [],
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
    mappaEnabled: FeatureFlags.getInstance().get('MAPPA_ENABLED'),
    ddVersion5: FeatureFlags.getInstance().get('DD_V5_1_ENABLED'),
  }
}

const construct = (
  installationAndRisk: InstallationAndRisk | null,
  formData: InstallationAndRiskFormData,
  errors: ValidationResult,
): InstallationAndRiskViewModel => {
  if (errors.length > 0) {
    return constructFromFormData(formData, errors)
  }

  return createFromEntity(installationAndRisk)
}

export default {
  construct,
}
