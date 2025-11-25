import superagent from 'superagent'
import Address from './Address'
import AddressSearch from './AddressSearch'

jest.mock('superagent')

describe('address search', () => {
  it('searches via postcode', async () => {
    const mockResponse = {
      results: [
        {
          DPA: {
            ADDRESS: 'address string',
            ORGANISATION_NAME: 'text',
            DEPARTMENT_NAME: 'text',
            SUB_BUILDING_NAME: 'text',
            BUILDING_NAME: 'text',
            BUILDING_NUMBER: 1,
            DEPENDENT_THOROUGHFARE_NAME: 'text',
            THOROUGHFARE_NAME: 'text',
            DOUBLE_DEPENDENT_LOCALITY: 'text',
            DEPENDENT_LOCALITY: 'text',
            POST_TOWN: 'text',
            POSTCODE: 'text',
          },
        },
      ],
    }
    const mockSet = jest.fn().mockResolvedValue({ body: mockResponse })
    const mockGet = jest.fn().mockReturnValue({ set: mockSet })
    ;(superagent.get as jest.Mock) = mockGet

    const addressSearch = new AddressSearch()

    const testPostcode = 'SA112AA'
    const results = await addressSearch.search(testPostcode)

    expect(results.length).toBe(1)
    expect(results[0]).toEqual(Address.fromJson(mockResponse.results[0].DPA))
  })
})
