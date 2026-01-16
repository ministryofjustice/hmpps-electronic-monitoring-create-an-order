import RestClient from '../data/restClient'
import UserCohortModel, { UserCohort } from '../models/UserCohort'
import CacheService from './cache/cacheService'

export default class UserCohortService {
  constructor(
    private readonly apiClient: RestClient,
    private readonly cache: CacheService<UserCohort>,
  ) {}

  async getUserCohort(accessToken: string) {
    let result = await this.cache.getItemFromCache(accessToken)
    if (result === null) {
      result = await this.getUserCohortFromApi(accessToken)
      await this.cache.storeItemToCache(accessToken, result, 60)
    }
    return result
  }

  private async getUserCohortFromApi(accessToken: string): Promise<UserCohort> {
    const result = await this.apiClient.get({
      path: '/api/user-cohort',
      token: accessToken,
    })
    return UserCohortModel.parse(result)
  }
}
