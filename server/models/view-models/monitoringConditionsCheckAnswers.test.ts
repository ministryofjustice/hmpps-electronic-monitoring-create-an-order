import {
  createCurfewConditions,
  createCurfewReleaseDateConditions,
  createInterestedParties,
  createMonitoringConditions,
  getMockOrder,
} from '../../../test/mocks/mockOrder'
import getEnglishContent from '../../i18n/en'
import createViewModel from './monitoringConditionsCheckAnswers'

describe('monitoringConditionsCheckAnswers', () => {
  const content = getEnglishContent('DDV6')

  describe('curfewReleaseDate answers', () => {
    it('does not show the saved release day times when the order is not eligible for curfew day of release', () => {
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({ curfew: true, startDate: '2020-01-01T00:00:00.000Z' }),
        interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
        curfewConditions: createCurfewConditions({ startDate: '2020-01-01T00:00:00.000Z' }),
        curfewReleaseDateConditions: createCurfewReleaseDateConditions({
          startTime: '19:00:00',
          endTime: '07:00:00',
        }),
      })

      const viewModel = createViewModel(order, content, false)

      expect(viewModel.curfewReleaseDate).toEqual([])
    })

    it('still shows the saved release day times when the order is eligible for curfew day of release', () => {
      const order = getMockOrder({
        monitoringConditions: createMonitoringConditions({ curfew: true }),
        interestedParties: createInterestedParties({ notifyingOrganisation: 'PRISON' }),
        curfewConditions: createCurfewConditions({ startDate: '2020-01-01T00:00:00.000Z' }),
        curfewReleaseDateConditions: createCurfewReleaseDateConditions({
          startTime: '19:00:00',
          endTime: '07:00:00',
        }),
      })

      const viewModel = createViewModel(order, content, false)

      expect(viewModel.curfewReleaseDate).toHaveLength(2)
    })
  })
})
