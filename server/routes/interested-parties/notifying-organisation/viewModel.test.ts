import { NotifyingOrganisationInput } from './formModel'
import ViewModel from './viewModel'

describe('view model', () => {
  it('returns empty model when no data', () => {
    const model = ViewModel.construct({} as NotifyingOrganisationInput, [])

    expect(model).toEqual({
      notifyingOrganisation: {
        value: '',
      },
      notifyingOrganisationName: {
        value: '',
      },
      notifyingOrganisationEmail: {
        value: '',
      },
      errorSummary: null,
    })
  })
})
