import paths from '../../constants/paths'
import nextPage, { getSelectedMonitoringTypes } from './nextPage'

describe('nextPage', () => {
  it('should return the first selected page if the current page is undefined', () => {
    const allPages = ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol']
    const allPagesResult = nextPage(allPages)
    expect(allPagesResult).toEqual(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE)

    const somePages = ['trail', 'mandatoryAttendance', 'alcohol']
    const somePagesResult = nextPage(somePages)
    expect(somePagesResult).toEqual(paths.MONITORING_CONDITIONS.TRAIL)
  })

  it('should return the summary page if there are no selected pages', () => {
    const result = nextPage([])
    expect(result).toEqual(paths.ORDER.SUMMARY)
  })

  it('should return the next selected page if the current page is set', () => {
    const allPages = ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol']
    const result = nextPage(allPages, 'trail')
    expect(result).toEqual(paths.MONITORING_CONDITIONS.ATTENDANCE)
  })

  it('should not rely on the order of the passed in pages', () => {
    const allPages = ['trail', 'alcohol', 'curfew', 'mandatoryAttendance', 'exclusionZone']
    const result = nextPage(allPages, 'trail')
    expect(result).toEqual(paths.MONITORING_CONDITIONS.ATTENDANCE)

    const result2 = nextPage(allPages)
    expect(result2).toEqual(paths.MONITORING_CONDITIONS.CURFEW_DAY_OF_RELEASE)
  })

  it('should return the summary page if the currently selected page is the last page', () => {
    const allPages = ['curfew', 'exclusionZone', 'trail', 'mandatoryAttendance', 'alcohol']
    const result = nextPage(allPages, 'alcohol')
    expect(result).toEqual(paths.ORDER.SUMMARY)
  })
})

describe('getSelectedMonitoringTypes', () => {
  it('should return a list of selected types from the MonitoringConditions object', () => {
    const conditions = {
      orderType: 'immigration',
      acquisitiveCrime: true,
      dapol: true,
      curfew: true,
      exclusionZone: false,
      trail: true,
      mandatoryAttendance: false,
      alcohol: true,
      devicesRequired: '250',
    }
    const result = getSelectedMonitoringTypes(conditions)
    expect(result).toStrictEqual(['curfew', 'trail', 'alcohol'])
  })
})
