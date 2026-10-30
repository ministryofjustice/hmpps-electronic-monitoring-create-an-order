import AdultAtInstallationViewModel from './viewModel'

describe('AdultAtInstallationViewModel', () => {
  it('answers Yes when a responsible adult is required, because the device wearer is not an adult', () => {
    const model = AdultAtInstallationViewModel.construct('false', false)

    expect(model.adultAtTimeOfInstallation.value).toEqual('false')
    expect(model.adultAtTimeOfInstallation.items).toEqual([
      { value: 'false', text: 'Yes', disabled: false },
      { value: 'true', text: 'No', disabled: false },
    ])
    expect(model.errorSummary).toBeNull()
  })

  it('disables the answers when the order cannot be edited', () => {
    const model = AdultAtInstallationViewModel.construct('true', true)

    expect(model.adultAtTimeOfInstallation.items.every(({ disabled }) => disabled)).toBe(true)
  })

  it('shows validation errors against the question and in the error summary', () => {
    const model = AdultAtInstallationViewModel.construct('', false, [
      { field: 'adultAtTimeOfInstallation', error: 'Select yes if a responsible adult is required' },
    ])

    expect(model.adultAtTimeOfInstallation.error).toEqual({ text: 'Select yes if a responsible adult is required' })
    expect(model.errorSummary).toEqual({
      titleText: 'There is a problem',
      errorList: [{ text: 'Select yes if a responsible adult is required', href: '#adultAtTimeOfInstallation' }],
    })
  })
})
