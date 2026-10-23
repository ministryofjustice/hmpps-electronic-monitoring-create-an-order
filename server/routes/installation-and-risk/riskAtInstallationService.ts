import RestClient from '../../data/restClient'
import { AuthenticatedRequestInput } from '../../interfaces/request'
import DetailsOfInstallationModel, { DetailsOfInstallation } from '../../models/DetailsOfInstallation'
import { Order } from '../../models/Order'
import { ValidationResult } from '../../models/Validation'
import { SanitisedError } from '../../sanitisedError'
import { convertBackendErrorToValidationError } from '../../utils/validation/errors'
import { RiskAtInstallation } from './riskAtInstallationModel'
import RiskAtInstallationStoreService from './riskAtInstallationStoreService'
import { RISK_TO_GENDER } from './riskCodes'

type SubmitRiskAtInstallationInput = AuthenticatedRequestInput & { order: Order }

export default class RiskAtInstallationService {
  constructor(
    private readonly store: RiskAtInstallationStoreService,
    private readonly apiClient: RestClient,
  ) {}

  getRiskAtInstallation(order: Order): Promise<RiskAtInstallation> {
    return this.store.getRiskAtInstallation(order)
  }

  async saveRiskBehaviour(
    order: Order,
    { possibleRisk, genderRiskDetails }: Pick<RiskAtInstallation, 'possibleRisk' | 'genderRiskDetails'>,
  ) {
    await this.store.update(order, {
      possibleRisk,
      genderRiskDetails: possibleRisk.includes(RISK_TO_GENDER) ? genderRiskDetails : '',
    })
  }

  async saveRiskAtAddress(order: Order, { riskCategory }: Pick<RiskAtInstallation, 'riskCategory'>) {
    await this.store.update(order, { riskCategory })
  }

  async saveOtherRisks(
    order: Order,
    { hasOtherRisks, riskDetails }: Pick<RiskAtInstallation, 'hasOtherRisks' | 'riskDetails'>,
  ) {
    await this.store.update(order, { hasOtherRisks, riskDetails: hasOtherRisks === 'YES' ? riskDetails : '' })
  }

  async submit({
    accessToken,
    order,
  }: SubmitRiskAtInstallationInput): Promise<DetailsOfInstallation | ValidationResult> {
    const { possibleRisk, riskCategory, riskDetails, genderRiskDetails } = await this.store.getRiskAtInstallation(order)

    try {
      const result = await this.apiClient.put({
        path: `/api/orders/${order.id}/details-of-installation`,
        data: { riskCategory: [...possibleRisk, ...riskCategory], riskDetails, genderRiskDetails },
        token: accessToken,
      })
      return DetailsOfInstallationModel.parse(result)
    } catch (e) {
      const sanitisedError = e as SanitisedError
      if (sanitisedError.status === 400) {
        return convertBackendErrorToValidationError(sanitisedError)
      }

      throw e
    }
  }
}
