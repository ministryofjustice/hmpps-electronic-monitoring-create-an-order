import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'
import DeviceWearerSearchResultsController from './controller'
import DeviceWearerSearchResultsService from './service'

describe('DeviceWearerSearchResultsController', () => {
  const mockService = {
    getSearchResult: jest.fn(),
    confirmSearchResult: jest.fn(),
    getStoredDeviceWearer: jest.fn(),
    hasSearchMatch: jest.fn(),
    getDisplayDateOfBirth: jest.fn(),
  } as unknown as jest.Mocked<DeviceWearerSearchResultsService>

  let store: InMemoryStore
  let storeService: DeviceWearerStoreService
  let answersService: DeviceWearerAnswersService
  let controller: DeviceWearerSearchResultsController

  beforeEach(() => {
    jest.resetAllMocks()
    store = new InMemoryStore()
    storeService = new DeviceWearerStoreService(store)
    answersService = new DeviceWearerAnswersService(storeService, {} as RestClient)
    controller = new DeviceWearerSearchResultsController(mockService, answersService)
  })

  describe('view', () => {
    it('calls backend service with searchedIdentifier query parameter', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        params: {
          identifyNumber: 'A1234BC',
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
          enterDetailsManuallyLink: paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
        }),
      )
    })

    it('redirects to the device wearer page when the search fails with a server error', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        params: {
          identifyNumber: 'A1234BC',
        },
      })
      const res = createMockResponse()

      mockService.getSearchResult.mockRejectedValue({ status: 500 })

      await controller.view(req, res, jest.fn())

      expect(res.render).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
      )
    })

    it('does not swallow errors that are not server errors', async () => {
      const order = getMockOrder()
      const req = createMockRequest({
        order,
        params: {
          identifyNumber: 'A1234BC',
        },
      })
      const res = createMockResponse()

      mockService.getSearchResult.mockRejectedValue({ status: 401 })

      await expect(controller.view(req, res, jest.fn())).rejects.toEqual({ status: 401 })
      expect(res.redirect).not.toHaveBeenCalled()
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
      mockService.getStoredDeviceWearer.mockResolvedValue(order.deviceWearer)

      await controller.update(req, res, jest.fn())

      expect(mockService.confirmSearchResult).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: order.id,
        searchedIdentifier: 'A1234BC',
      })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
      )
    })

    it('leaves gender null when the person found has no gender in CPR', async () => {
      const order = getMockOrder({ deviceWearer: createDeviceWearer({ firstName: null, gender: null }) })
      const fromCpr = createDeviceWearer({ firstName: 'Ermintrude', sex: 'FEMALE', gender: null })
      mockService.getStoredDeviceWearer.mockResolvedValue(fromCpr)
      const req = createMockRequest({ order, body: { action: 'continue', searchedIdentifier: 'A1234BC' } })

      await controller.update(req, createMockResponse(), jest.fn())

      const answers = await storeService.getDeviceWearer({ ...order, deviceWearer: fromCpr })
      expect(answers.gender).toBeNull()
      expect(answers.firstName).toEqual('Ermintrude')
      expect(answers.sex).toEqual('FEMALE')
      expect(store.map.size).toEqual(0)
      expect(mockService.getStoredDeviceWearer).not.toHaveBeenCalled()
    })

    it('keeps the gender of the person found', async () => {
      const order = getMockOrder()
      const fromCpr = createDeviceWearer({ firstName: 'Ermintrude', gender: 'FEMALE' })
      mockService.getStoredDeviceWearer.mockResolvedValue(fromCpr)
      const req = createMockRequest({ order, body: { action: 'continue', searchedIdentifier: 'A1234BC' } })

      await controller.update(req, createMockResponse(), jest.fn())

      expect((await storeService.getDeviceWearer({ ...order, deviceWearer: fromCpr })).gender).toEqual('FEMALE')
    })

    it('does not read back the saved person to apply a gender default', async () => {
      const order = getMockOrder()
      const apiClient = {
        put: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockRejectedValue({ status: 500, message: 'Internal Server Error' }),
      } as unknown as jest.Mocked<RestClient>
      const realController = new DeviceWearerSearchResultsController(
        new DeviceWearerSearchResultsService(apiClient),
        answersService,
      )
      const req = createMockRequest({ order, body: { action: 'continue', searchedIdentifier: 'A1234BC' } })
      const res = createMockResponse()

      await realController.update(req, res, jest.fn())

      expect(apiClient.put).toHaveBeenCalledTimes(1)
      expect(apiClient.get).not.toHaveBeenCalled()
      expect(store.map.size).toEqual(0)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
      )
    })

    it('does not hide a failure to save the person found', async () => {
      const order = getMockOrder()
      mockService.confirmSearchResult.mockRejectedValue({ status: 500 })
      const req = createMockRequest({ order, body: { action: 'continue', searchedIdentifier: 'A1234BC' } })
      const res = createMockResponse()

      await expect(controller.update(req, res, jest.fn())).rejects.toEqual({ status: 500 })
      expect(mockService.getStoredDeviceWearer).not.toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
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
