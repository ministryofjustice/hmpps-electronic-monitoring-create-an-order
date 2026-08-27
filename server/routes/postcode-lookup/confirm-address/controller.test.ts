import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'
import PostcodeService from '../postcodeService'
import TaskListService from '../../../services/taskListService'
import AddressService from '../../../services/addressService'
import DeviceWearerService from '../../../services/deviceWearerService'
import CorePersonRecordService from '../core-person-record/service'
import ConfirmAddressController from './controller'

describe('ConfirmAddressController', () => {
  const postcodeService = { buildUrl: jest.fn() } as unknown as jest.Mocked<PostcodeService>
  const taskListService = { getNextPage: jest.fn() } as unknown as jest.Mocked<TaskListService>
  const corePersonRecordService = {
    getPersonDetails: jest.fn(),
    getOrganisationSearchId: jest.fn(),
  } as unknown as jest.Mocked<CorePersonRecordService>
  const addressService = { updateAddress: jest.fn() } as unknown as jest.Mocked<AddressService>
  const deviceWearerService = { updateNoFixedAbode: jest.fn() } as unknown as jest.Mocked<DeviceWearerService>
  const controller = new ConfirmAddressController(
    postcodeService,
    taskListService,
    corePersonRecordService,
    addressService,
    deviceWearerService,
  )

  beforeEach(() => jest.resetAllMocks())

  it('renders a primary CPR address for confirmation', async () => {
    const order = getMockOrder({ addresses: [] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: { organisationSearchId: 'A1234BC' },
    })
    const res = createMockResponse(order)
    corePersonRecordService.getPersonDetails.mockResolvedValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1980-01-01T00:00:00Z',
      organisationSearchId: 'A1234BC',
      addresses: [createAddress({ addressLine1: '1 Washington Street', postcode: 'WR1 1NL' })],
    })

    await controller.view(req, res, jest.fn())

    expect(corePersonRecordService.getPersonDetails).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      organisationSearchId: 'A1234BC',
    })
    expect(res.render).toHaveBeenCalledWith(
      'pages/order/postcode-lookup/confirm-address',
      expect.objectContaining({
        addressLines: ['1 Washington Street', 'WR1 1NL'],
        isCorePersonRecordAddress: true,
        noFixedAddressLink: `/order/${order.id}/contact-information/no-fixed-abode`,
      }),
    )
  })

  it('redirects to the fixed address page when CPR has no primary address', async () => {
    const order = getMockOrder({ addresses: [] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: { organisationSearchId: 'A1234BC' },
    })
    const res = createMockResponse(order)
    corePersonRecordService.getPersonDetails.mockResolvedValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: null,
      organisationSearchId: 'A1234BC',
      addresses: [],
    })

    await controller.view(req, res, jest.fn())

    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/no-fixed-abode`)
  })

  it('redirects to the fixed address page when CPR returns not found', async () => {
    const order = getMockOrder({ addresses: [] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: { organisationSearchId: 'A1234BC' },
    })
    const res = createMockResponse(order)
    corePersonRecordService.getPersonDetails.mockRejectedValue(Object.assign(new Error('Not found'), { status: 404 }))

    await controller.view(req, res, jest.fn())

    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/contact-information/no-fixed-abode`)
  })

  it('propagates CPR errors other than not found', async () => {
    const order = getMockOrder({ addresses: [] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: { organisationSearchId: 'A1234BC' },
    })
    const res = createMockResponse(order)
    const error = Object.assign(new Error('Unavailable'), { status: 503 })
    corePersonRecordService.getPersonDetails.mockRejectedValue(error)

    await expect(controller.view(req, res, jest.fn())).rejects.toBe(error)
  })

  it('renders an existing postcode address without calling CPR', async () => {
    const primaryAddress = createAddress({ addressLine1: '1 Washington Street', postcode: 'WR1 1NL' })
    const order = getMockOrder({ addresses: [primaryAddress] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: {},
    })
    const res = createMockResponse(order)

    await controller.view(req, res, jest.fn())

    expect(corePersonRecordService.getPersonDetails).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(
      'pages/order/postcode-lookup/confirm-address',
      expect.objectContaining({ isCorePersonRecordAddress: false }),
    )
  })

  it('stores the CPR primary address and fixed address state after confirmation', async () => {
    const order = getMockOrder({ addresses: [] })
    const primaryAddress = createAddress({ addressLine1: '1 Washington Street', postcode: 'WR1 1NL' })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: { organisationSearchId: 'A1234BC' },
      body: { action: 'continue' },
    })
    const res = createMockResponse(order)
    corePersonRecordService.getPersonDetails.mockResolvedValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1980-01-01T00:00:00Z',
      organisationSearchId: 'A1234BC',
      addresses: [primaryAddress],
    })
    addressService.updateAddress.mockResolvedValue(primaryAddress)
    deviceWearerService.updateNoFixedAbode.mockResolvedValue({ ...order.deviceWearer, noFixedAbode: false })

    await controller.update(req, res, jest.fn())

    expect(corePersonRecordService.getPersonDetails).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      organisationSearchId: 'A1234BC',
    })
    expect(addressService.updateAddress).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      data: primaryAddress,
    })
    expect(deviceWearerService.updateNoFixedAbode).toHaveBeenCalledWith({
      accessToken: 'fakeUserToken',
      orderId: order.id,
      data: { noFixedAbode: false },
    })
    expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/address-list`)
  })
})
