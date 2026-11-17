import AdultAtInstallationFormModel, { AdultAtInstallationFormValidator } from './formModel'

describe('AdultAtInstallation form', () => {
  it('defaults an unanswered question to an empty answer', () => {
    expect(AdultAtInstallationFormModel.parse({ action: 'continue' })).toEqual({
      action: 'continue',
      adultAtTimeOfInstallation: '',
    })
  })

  it.each([
    ['false', false],
    ['true', true],
  ])('accepts %s', (answer, adultAtTimeOfInstallation) => {
    expect(AdultAtInstallationFormValidator.parse({ adultAtTimeOfInstallation: answer })).toEqual({
      adultAtTimeOfInstallation,
    })
  })

  it('requires an answer', () => {
    const result = AdultAtInstallationFormValidator.safeParse({ adultAtTimeOfInstallation: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({
        path: ['adultAtTimeOfInstallation'],
        message: 'Select yes if a responsible adult is required',
      }),
    )
  })
})
