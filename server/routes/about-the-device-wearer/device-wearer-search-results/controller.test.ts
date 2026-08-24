import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import DeviceWearerSearchResultsController from './controller'
import DeviceWearerSearchResultsService from './service'

describe('DeviceWearerSearchResultsController', () => {
  const mockService = {
    getSearchResult: jest.fn(),
    confirmSearchResult: jest.fn(),
    hasSearchMatch: jest.fn(),
    getDisplayDateOfBirth: jest.fn(),
  } as unknown as jest.Mocked<DeviceWearerSearchResultsService>

  const controller = new DeviceWearerSearchResultsController(mockService)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('view', () => {
    it('calls backend service with searchedIdentifier query parameter', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        query: {
          searchedIdentifier: 'A1234BC',
        },
      })
      const res = createMockResponse()

      mockService.getSearchResult.mockResolvedValue({
        fullName: 'Ermintrude Jones',
        dateOfBirth: '1974-01-19T00:00:00Z',
      })
      mockService.hasSearchMatch.mockReturnValue(true)
      mockService.getDisplayDateOfBirth.mockReturnValue('19 January 1974')

      await controller.view(req, res, jest.fn())

      expect(mockService.getSearchResult).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: order.id,
        searchedIdentifier: 'A1234BC',
      })
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/device-wearer-search-results',
        expect.objectContaining({
          searchedIdentifier: 'A1234BC',
          fullName: 'Ermintrude Jones',
        }),
      )
    })
  })

  describe('update', () => {
    it('confirms selection and redirects to device wearer page on continue', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        body: {
          action: 'continue',
          searchedIdentifier: 'A1234BC',
        },
      })
      const res = createMockResponse()

      await controller.update(req, res, jest.fn())

      expect(mockService.confirmSearchResult).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: order.id,
        searchedIdentifier: 'A1234BC',
      })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id),
      )
    })

    it('redirects to summary on save as draft without backend confirm', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        body: {
          action: 'back',
          searchedIdentifier: 'A1234BC',
        },
      })
      const res = createMockResponse()

      await controller.update(req, res, jest.fn())

      expect(mockService.confirmSearchResult).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    })
  })
})
