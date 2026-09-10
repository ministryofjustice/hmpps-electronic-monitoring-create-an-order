import { getMockOrder } from '../../../test/mocks/mockOrder'
import FeatureFlags from '../../utils/featureFlags'
import TaskListService from '../../services/taskListService'
import { getNextRiskInformationPath, getRiskInformationTasks } from './riskInformationTasks'

describe('getRiskInformationTasks', () => {
  it.each([
    ['PRISON', ['DETAILS_OF_INSTALLATION', 'OFFENCE', 'OFFENCE_OTHER_INFO', 'CHECK_ANSWERS_INSTALLATION_AND_RISK']],
    ['FAMILY_COURT', ['DETAILS_OF_INSTALLATION', 'CHECK_ANSWERS_INSTALLATION_AND_RISK']],
    ['CIVIL_COUNTY_COURT', ['DETAILS_OF_INSTALLATION', 'CHECK_ANSWERS_INSTALLATION_AND_RISK']],
    ['HOME_OFFICE', ['DETAILS_OF_INSTALLATION', 'IS_MAPPA', 'MAPPA', 'CHECK_ANSWERS_INSTALLATION_AND_RISK']],
  ] as const)('builds the ordered %s tasks', (notifyingOrganisation, expectedPages) => {
    const order = getMockOrder({
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation,
      },
    })

    expect(getRiskInformationTasks(order).map(task => task.name)).toEqual(expectedPages)
  })

  it('requires MAPPA details only when the order is a MAPPA case', () => {
    const order = getMockOrder({
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation: 'HOME_OFFICE',
      },
      mappa: { isMappa: 'NO', level: null, category: null },
    })

    const mappaTask = getRiskInformationTasks(order).find(task => task.name === 'MAPPA')

    expect(mappaTask?.state).toBe('NOT_REQUIRED')

    order.mappa = { isMappa: 'YES', level: null, category: null }

    expect(getRiskInformationTasks(order).find(task => task.name === 'MAPPA')?.state).toBe('REQUIRED')
  })
})

describe('getNextRiskInformationPath', () => {
  const taskListService = new TaskListService()

  const orderFor = (notifyingOrganisation: 'PRISON' | 'CROWN_COURT') =>
    getMockOrder({
      dataDictionaryVersion: 'DDV6',
      interestedParties: {
        ...getMockOrder().interestedParties!,
        notifyingOrganisation,
      },
    })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('continues to the offence page after the risk pages', () => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockImplementation(flag => flag === 'OFFENCE_FLOW_ENABLED')
    const order = orderFor('PRISON')

    expect(getNextRiskInformationPath(taskListService, order, 'OFFENCE', '/fallback')).toContain('/offence-other-info')
  })

  it('uses the fallback when the page is not in the order flow', () => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockImplementation(flag => flag === 'OFFENCE_FLOW_ENABLED')
    const order = orderFor('CROWN_COURT')

    expect(getNextRiskInformationPath(taskListService, order, 'OFFENCE_OTHER_INFO', '/fallback')).toBe('/fallback')
  })

  it('uses the fallback when the offence flow is disabled', () => {
    jest.spyOn(FeatureFlags.getInstance(), 'get').mockReturnValue(false)
    const order = orderFor('PRISON')

    expect(getNextRiskInformationPath(taskListService, order, 'OFFENCE', '/order/:orderId/fallback')).toBe(
      `/order/${order.id}/fallback`,
    )
  })
})
