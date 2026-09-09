import RestClient from '../data/restClient'
import { NotifyingOrganisation } from '../models/NotifyingOrganisation'
import FeatureFlags from '../utils/featureFlags'
import { getRiskInformationFlow } from './riskInformationFlow'

type InitialiseRiskInformationInput = {
  orderId: string
  accessToken: string
  notifyingOrganisation: NotifyingOrganisation | null | undefined
}

export default class RiskInformationStaticOffenceService {
  constructor(private readonly apiClient: RestClient) {}

  async initialise(input: InitialiseRiskInformationInput): Promise<void> {
    if (!FeatureFlags.getInstance().get('OFFENCE_FLOW_ENABLED')) {
      return
    }

    const { offence } = getRiskInformationFlow(input.notifyingOrganisation)

    if (offence.mode !== 'FIXED') {
      return
    }
    // ensure setting VIOLENCE_AGAINST_THE_PERSON for civil courts
    await this.apiClient.put({
      path: `/api/orders/${input.orderId}/offence`,
      token: input.accessToken,
      data: {
        offences: [offence.offenceType],
        offenceType: offence.offenceType,
      },
    })
  }
}
