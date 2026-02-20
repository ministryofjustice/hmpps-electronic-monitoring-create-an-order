import { Order } from '../../../models/Order'
import { InterestedParties } from '../model'
import { NotifyingOrganisationInput } from './formModel'
import ViewModel from './viewModel'

describe('view model', () => {
  it('returns empty model when no data', () => {
    const data = {} as InterestedParties

    const model = ViewModel.construct(data, {} as NotifyingOrganisationInput, [], {} as Order)

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
      DDv5: false,
      errorSummary: null,
    })
  })

  it('returns the model with data', () => {
    const data = {
      notifyingOrganisation: 'PRISON',
      notifyingOrganisationName: 'prison name',
      notifyingOrganisationEmail: 'some email',
    } as InterestedParties

    const model = ViewModel.construct(data, undefined, [], {} as Order)

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
      DDv5: false,
      errorSummary: null,
    })
  })
})
