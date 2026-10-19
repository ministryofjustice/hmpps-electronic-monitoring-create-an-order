import { Order } from '../../models/Order'
import splitRisks from './splitRisks'
import isOrderDataDictionarySameOrAbove from '../../utils/dataDictionaryVersionComparer'
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

    return cached ? RiskAtInstallationModel.parse(JSON.parse(cached)) : this.fromOrder(order)
  }

  public async update(order: Order, changes: Partial<RiskAtInstallation>) {
    const riskAtInstallation = { ...(await this.getRiskAtInstallation(order)), ...changes }

    await this.dataStore.set(this.keyFromOrder(order), JSON.stringify(riskAtInstallation), CACHE_DURATION_SECONDS)
  }

  private fromOrder(order: Order): RiskAtInstallation {
    const saved = isOrderDataDictionarySameOrAbove('DDV6', order)
      ? order.detailsOfInstallation
      : order.installationAndRisk
    const { possibleRisk, riskCategory } = splitRisks(saved?.riskCategory, order.dataDictionaryVersion)

    const riskDetails = saved?.riskDetails ?? ''

    return {
      possibleRisk,
      riskCategory,
      riskDetails,
      hasOtherRisks: riskDetails ? 'YES' : null,
      genderRiskDetails: order.detailsOfInstallation?.genderRiskDetails ?? '',
    }
  }
}
