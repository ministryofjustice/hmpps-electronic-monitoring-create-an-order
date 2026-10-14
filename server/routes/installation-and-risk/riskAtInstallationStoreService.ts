import getContent from '../../i18n'
import { Order } from '../../models/Order'
import splitRisks from './splitRisks'
import Store from '../store/store'
import RiskAtInstallationModel, { RiskAtInstallation } from './riskAtInstallationModel'

const CACHE_DURATION_SECONDS = 24 * 60 * 60

export default class RiskAtInstallationStoreService {
  constructor(private readonly dataStore: Store) {}

  private keyFromOrder(order: Order): string {
    return `${order.id}+${order.versionId}+riskAtInstallation`
  }

  public async getRiskAtInstallation(order: Order): Promise<RiskAtInstallation> {
    const cached = await this.dataStore.get(this.keyFromOrder(order))
    const riskAtInstallation = cached ? RiskAtInstallationModel.parse(JSON.parse(cached)) : this.fromOrder(order)

    await this.updateRiskAtInstallation(order, riskAtInstallation)

    return riskAtInstallation
  }

  public async updateField<T extends keyof RiskAtInstallation>(order: Order, field: T, data: RiskAtInstallation[T]) {
    const riskAtInstallation = await this.getRiskAtInstallation(order)

    riskAtInstallation[field] = data

    await this.updateRiskAtInstallation(order, riskAtInstallation)
  }

  private async updateRiskAtInstallation(order: Order, data: RiskAtInstallation) {
    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify(data), CACHE_DURATION_SECONDS)
  }

  private fromOrder(order: Order): RiskAtInstallation {
    const { reference } = getContent('en', order.dataDictionaryVersion)
    const { possibleRisk, riskCategory } = splitRisks(order.detailsOfInstallation?.riskCategory, reference)

    return {
      possibleRisk,
      riskCategory,
      riskDetails: order.detailsOfInstallation?.riskDetails ?? '',
      genderRiskDetails: order.detailsOfInstallation?.genderRiskDetails ?? '',
    }
  }
}
