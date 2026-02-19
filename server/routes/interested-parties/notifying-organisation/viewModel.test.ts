import { InterestedParties } from '../model'
import ViewModel from './viewModel'

describe('view model', () => {
  it('returns empty model when no data', () => {
    const data = {} as InterestedParties

    const model = ViewModel.construct(data, [])

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

  it('returns the model with data', () => {
    const data = {
      notifyingOrganisation: 'PRISON',
      notifyingOrganisationName: 'prison name',
      notifyingOrganisationEmail: 'some email',
    } as InterestedParties

    const model = ViewModel.construct(data, [])

    expect(model).toEqual({
      notifyingOrganisation: {
        value: 'PRISON',
      },
      notifyingOrganisationName: {
        value: 'prison name',
      },
      notifyingOrganisationEmail: {
        value: 'some email',
      },
      errorSummary: null,
    })
  })
})
