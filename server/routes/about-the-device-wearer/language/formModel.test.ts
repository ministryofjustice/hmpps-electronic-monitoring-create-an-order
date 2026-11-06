import LanguageFormModel, { LanguageFormValidator } from './formModel'

describe('language form', () => {
  it('reads an empty submission as unanswered', () => {
    expect(LanguageFormModel.parse({})).toEqual({ action: 'continue', interpreterRequired: '', language: '' })
  })

  it('requires an answer to whether an interpreter is needed', () => {
    const result = LanguageFormValidator.safeParse({ interpreterRequired: '', language: '' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Select yes if the device wearer requires an interpreter',
        path: ['interpreterRequired'],
      }),
    ])
  })

  it('requires a language when an interpreter is needed', () => {
    const result = LanguageFormValidator.safeParse({ interpreterRequired: 'true', language: '' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({ message: 'Select the language required', path: ['language'] }),
    ])
  })

  it('accepts an interpreter with a language', () => {
    expect(LanguageFormValidator.parse({ interpreterRequired: 'true', language: 'Arabic' })).toEqual({
      interpreterRequired: true,
      language: 'Arabic',
    })
  })

  it('accepts no interpreter without a language', () => {
    expect(LanguageFormValidator.parse({ interpreterRequired: 'false', language: '' })).toEqual({
      interpreterRequired: false,
      language: '',
    })
  })

  it('sends no language when an interpreter is not needed', () => {
    expect(LanguageFormValidator.parse({ interpreterRequired: 'false', language: 'Arabic' })).toEqual({
      interpreterRequired: false,
      language: '',
    })
  })

  it("treats don't know as no interpreter needed", () => {
    expect(LanguageFormValidator.parse({ interpreterRequired: 'DONT_KNOW', language: 'Arabic' })).toEqual({
      interpreterRequired: false,
      language: '',
    })
  })

  it('rejects an answer that is not offered', () => {
    const result = LanguageFormValidator.safeParse({ interpreterRequired: 'maybe', language: '' })

    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        message: 'Select yes if the device wearer requires an interpreter',
        path: ['interpreterRequired'],
      }),
    ])
  })
})
