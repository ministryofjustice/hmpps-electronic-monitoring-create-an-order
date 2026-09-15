import { notifyingOrganisations } from '../models/NotifyingOrganisation'
import { defaultRiskInformationPages, getRiskInformationFlow } from './riskInformationFlow'

describe('getRiskInformationFlow', () => {
  const standardPages = [
    'DETAILS_OF_INSTALLATION',
    'OFFENCE',
    'OFFENCE_OTHER_INFO',
    'CHECK_ANSWERS_INSTALLATION_AND_RISK',
  ] as const
  const courtPages = ['DETAILS_OF_INSTALLATION', 'CHECK_ANSWERS_INSTALLATION_AND_RISK'] as const

  it('defines every supported Risk Information page, including DAPO', () => {
    expect(defaultRiskInformationPages).toEqual([
      'DETAILS_OF_INSTALLATION',
      'IS_MAPPA',
      'MAPPA',
      'OFFENCE',
      'OFFENCE_OTHER_INFO',
      'DAPO',
      'CHECK_ANSWERS_INSTALLATION_AND_RISK',
    ])
  })

  it.each([
    ['PRISON', standardPages],
    ['PROBATION', standardPages],
    ['YOUTH_CUSTODY_SERVICE', standardPages],
    ['FAMILY_COURT', courtPages],
    ['CIVIL_COUNTY_COURT', courtPages],
    ['CROWN_COURT', courtPages],
    ['MAGISTRATES_COURT', courtPages],
    ['MILITARY_COURT', courtPages],
    ['SCOTTISH_COURT', courtPages],
    ['YOUTH_COURT', courtPages],
    ['HOME_OFFICE', ['DETAILS_OF_INSTALLATION', 'IS_MAPPA', 'MAPPA', 'CHECK_ANSWERS_INSTALLATION_AND_RISK']],
  ] as const)('resolves the existing %s journey', (notifyingOrganisation, pages) => {
    expect(getRiskInformationFlow(notifyingOrganisation)).toEqual({ pages })
  })

  it.each(notifyingOrganisations)('filters DAPO from the current %s profile', notifyingOrganisation => {
    expect(getRiskInformationFlow(notifyingOrganisation).pages).not.toContain('DAPO')
  })

  it('defaults to the standard profile until a notifying organisation is selected', () => {
    expect(getRiskInformationFlow(null)).toEqual({
      pages: standardPages,
    })
  })
})
