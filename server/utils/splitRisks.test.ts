import getContent from '../i18n'
import splitRisks from './splitRisks'

describe('splitRisks', () => {
  const { reference } = getContent('en', 'DDV6')
  const [behaviourRisk] = Object.keys(reference.possibleRisks)
  const [addressRisk] = Object.keys(reference.riskCategories)

  it('splits codes into behaviour risks and address risks', () => {
    expect(splitRisks([behaviourRisk, addressRisk], reference)).toEqual({
      possibleRisk: [behaviourRisk],
      riskCategory: [addressRisk],
    })
  })

  it('ignores unknown codes', () => {
    expect(splitRisks(['UNKNOWN'], reference)).toEqual({ possibleRisk: [], riskCategory: [] })
  })

  it.each([null, undefined])('returns empty lists for %s', codes => {
    expect(splitRisks(codes, reference)).toEqual({ possibleRisk: [], riskCategory: [] })
  })
})
