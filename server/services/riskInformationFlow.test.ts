import { notifyingOrganisations } from '../models/NotifyingOrganisation'
import {
  defaultRiskInformationPages,
  getRiskInformationFlow,
  notifyingOrganisationRiskProfiles,
} from './riskInformationFlow'

describe('getRiskInformationFlow', () => {
  const standardPages = [
    'OFFENCE',
    'OFFENCE_OTHER_INFO',
    'DETAILS_OF_INSTALLATION',
    'CHECK_ANSWERS_INSTALLATION_AND_RISK',
  ] as const
  const courtPages = ['DETAILS_OF_INSTALLATION', 'CHECK_ANSWERS_INSTALLATION_AND_RISK'] as const

  it('defines every supported Risk Information page, including DAPO', () => {
    expect(defaultRiskInformationPages).toEqual([
      'OFFENCE',
      'OFFENCE_OTHER_INFO',
      'DAPO',
      'DETAILS_OF_INSTALLATION',
      'IS_MAPPA',
      'MAPPA',
      'CHECK_ANSWERS_INSTALLATION_AND_RISK',
    ])
  })

  it('assigns a profile to every notifying organisation', () => {
    expect(Object.keys(notifyingOrganisationRiskProfiles).sort()).toEqual([...notifyingOrganisations].sort())
  })

  it.each([
    ['PRISON', standardPages, { mode: 'USER_ENTERED' }],
    ['PROBATION', standardPages, { mode: 'USER_ENTERED' }],
    ['YOUTH_CUSTODY_SERVICE', standardPages, { mode: 'USER_ENTERED' }],
    ['FAMILY_COURT', courtPages, { mode: 'NONE' }],
    ['CIVIL_COUNTY_COURT', courtPages, { mode: 'NONE' }],
    ['CROWN_COURT', courtPages, { mode: 'NONE' }],
    ['MAGISTRATES_COURT', courtPages, { mode: 'NONE' }],
    ['MILITARY_COURT', courtPages, { mode: 'NONE' }],
    ['SCOTTISH_COURT', courtPages, { mode: 'NONE' }],
    ['YOUTH_COURT', courtPages, { mode: 'NONE' }],
    [
      'HOME_OFFICE',
      ['DETAILS_OF_INSTALLATION', 'IS_MAPPA', 'MAPPA', 'CHECK_ANSWERS_INSTALLATION_AND_RISK'],
      { mode: 'NONE' },
    ],
  ] as const)('resolves the existing %s journey', (notifyingOrganisation, pages, offence) => {
    expect(getRiskInformationFlow(notifyingOrganisation)).toEqual({ pages, offence })
  })

  it.each(notifyingOrganisations)('filters DAPO from the current %s profile', notifyingOrganisation => {
    expect(getRiskInformationFlow(notifyingOrganisation).pages).not.toContain('DAPO')
  })

  it('defaults to the standard profile until a notifying organisation is selected', () => {
    expect(getRiskInformationFlow(null)).toEqual({
      pages: standardPages,
      offence: { mode: 'USER_ENTERED' },
    })
  })
})
