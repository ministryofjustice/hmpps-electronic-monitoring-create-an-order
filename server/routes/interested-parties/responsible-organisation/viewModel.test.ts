import { Order } from '../../../models/Order'
import { InterestedParties } from '../model'
import { ResponsibleOrganisationInput } from './formModel'
import ViewModel from './viewModel'

describe('view model', () => {
  it('returns empty model when no data', () => {
    const data = {} as InterestedParties

    const model = ViewModel.construct(data, {} as ResponsibleOrganisationInput, [], {} as Order)

    expect(model).toEqual({
      responsibleOrganisation: {
        value: '',
      },
      responsibleOrganisationRegion: {
        value: '',
      },
      responsibleOrganisationEmail: {
        value: '',
      },
      DDv5: false,
      errorSummary: null,
    })
  })

  it('returns the model with data', () => {
    const data = {
      responsibleOrganisation: 'POLICE',
      responsibleOrganisationRegion: 'North Yorkshire',
      responsibleOrganisationEmail: 'some email',
    } as InterestedParties

    const model = ViewModel.construct(data, undefined, [], {} as Order)

    expect(model).toEqual({
      responsibleOrganisation: {
        value: 'POLICE',
      },
      responsibleOrganisationRegion: {
        value: 'North Yorkshire',
      },
      responsibleOrganisationEmail: {
        value: 'some email',
      },
      DDv5: false,
      errorSummary: null,
    })
  })
})
