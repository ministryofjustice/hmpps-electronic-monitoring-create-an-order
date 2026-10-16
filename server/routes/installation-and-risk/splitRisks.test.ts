import getContent from '../../i18n'
import splitRisks from './splitRisks'
import { getRiskCategoryCodes, POSSIBLE_RISK_CODES } from './riskCodes'

describe('splitRisks', () => {
  it('splits codes into behaviour risks and address risks', () => {
    expect(splitRisks(['SEXUAL_OFFENCES', 'IOM'], 'DDV6')).toEqual({
      possibleRisk: ['SEXUAL_OFFENCES'],
      riskCategory: ['IOM'],
    })
  })

  it('ignores unknown codes', () => {
    expect(splitRisks(['UNKNOWN'], 'DDV6')).toEqual({ possibleRisk: [], riskCategory: [] })
  })

  it.each([null, undefined])('returns empty lists for %s', codes => {
    expect(splitRisks(codes, 'DDV6')).toEqual({ possibleRisk: [], riskCategory: [] })
  })

  it('treats SAFEGUARDING_ISSUE as a risk category only in DDV4', () => {
    expect(splitRisks(['SAFEGUARDING_ISSUE'], 'DDV4').riskCategory).toEqual(['SAFEGUARDING_ISSUE'])
    expect(splitRisks(['SAFEGUARDING_ISSUE'], 'DDV5').riskCategory).toEqual([])
  })

  it('treats split safeguarding codes as risk categories from DDV5', () => {
    expect(splitRisks(['SAFEGUARDING_CHILD'], 'DDV4').riskCategory).toEqual([])
    expect(splitRisks(['SAFEGUARDING_CHILD'], 'DDV7').riskCategory).toEqual(['SAFEGUARDING_CHILD'])
  })

  it('treats the no-risk and unknown address codes as risk categories from DDV5', () => {
    const codes = ['NO_RISK_AT_ADDRESS', 'RISK_AT_ADDRESS_UNKNOWN']
    expect(splitRisks(codes, 'DDV4').riskCategory).toEqual([])
    expect(splitRisks(codes, 'DDV6').riskCategory).toEqual(codes)
  })

  it.each(['DDV4', 'DDV5', 'DDV6', 'DDV7'] as const)('constants match the i18n reference for %s', version => {
    const { reference } = getContent('en', version)

    expect([...POSSIBLE_RISK_CODES].sort()).toEqual(Object.keys(reference.possibleRisks).sort())
    expect([...getRiskCategoryCodes(version)].sort()).toEqual(Object.keys(reference.riskCategories).sort())
  })
})
