import LanguageViewModel from './viewModel'

const labels = { title: 'Language', interpreterRequiredDontKnow: "Don't know" }

describe('language view model', () => {
  it('has no answer when nothing is saved', () => {
    const result = LanguageViewModel.construct({ interpreterRequired: null, language: null }, labels, false)

    expect(result.interpreterRequired.value).toBe('')
    expect(result.language.value).toBe('')
    expect(result.errorSummary).toBeNull()
  })

  it('shows saved answers', () => {
    const result = LanguageViewModel.construct({ interpreterRequired: true, language: 'Arabic' }, labels, false)

    expect(result.interpreterRequired.value).toBe('true')
    expect(result.language.value).toBe('Arabic')
  })

  it('shows a saved answer of no, which is also how a submitted "don\'t know" reads back', () => {
    expect(LanguageViewModel.construct({ interpreterRequired: false }, labels, false).interpreterRequired.value).toBe(
      'false',
    )
  })

  it('shows rejected answers as they were submitted', () => {
    const result = LanguageViewModel.construct({ interpreterRequired: 'true', language: '' }, labels, false)

    expect(result.interpreterRequired.value).toBe('true')
    expect(result.language.value).toBe('')
  })

  it("shows a don't know answer that has not been submitted yet", () => {
    expect(
      LanguageViewModel.construct({ interpreterRequired: 'DONT_KNOW' }, labels, false).interpreterRequired.value,
    ).toBe('DONT_KNOW')
  })

  it("offers yes and no, then don't know after an or divider, disabled when the order is not editable", () => {
    expect(LanguageViewModel.construct({}, labels, true).interpreterRequired.items).toEqual([
      { value: 'true', text: 'Yes', disabled: true },
      { value: 'false', text: 'No', disabled: true },
      { divider: 'or' },
      { value: 'DONT_KNOW', text: "Don't know", disabled: true },
    ])
  })

  it('maps errors to their fields and the summary', () => {
    const result = LanguageViewModel.construct({ interpreterRequired: 'true', language: '' }, labels, false, [
      { error: 'Select the language required', field: 'language' },
    ])

    expect(result.language.error?.text).toBe('Select the language required')
    expect(result.interpreterRequired.error).toBeUndefined()
    expect(result.errorSummary?.errorList).toEqual([{ href: '#language', text: 'Select the language required' }])
  })
})
