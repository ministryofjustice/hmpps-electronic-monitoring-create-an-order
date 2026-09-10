import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'
import PostcodeService from '../postcodeService'
import TaskListService from '../../../services/taskListService'
import AddressService from '../../../services/addressService'
import DeviceWearerService from '../../../services/deviceWearerService'
import ConfirmAddressController from './controller'

describe('ConfirmAddressController', () => {
  const postcodeService = { buildUrl: jest.fn() } as unknown as jest.Mocked<PostcodeService>
  const taskListService = { getNextPage: jest.fn() } as unknown as jest.Mocked<TaskListService>
  const addressService = { updateAddress: jest.fn() } as unknown as jest.Mocked<AddressService>
  const deviceWearerService = { updateNoFixedAbode: jest.fn() } as unknown as jest.Mocked<DeviceWearerService>
  const controller = new ConfirmAddressController(postcodeService, taskListService, addressService, deviceWearerService)

  beforeEach(() => jest.resetAllMocks())

  it('renders a stored primary CPR address for confirmation', async () => {
    const primaryAddress = createAddress({
      addressLine1: '1 Washington Street',
      postcode: 'WR1 1NL',
      addressSource: 'CORE_PERSON_RECORD',
    })
    const order = getMockOrder({ addresses: [primaryAddress] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: {},
    })
    const res = createMockResponse(order)

    await controller.view(req, res, jest.fn())

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/postcode-lookup/confirm-address',
      expect.objectContaining({
        addressLines: ['1 Washington Street', 'WR1 1NL'],
        isCorePersonRecordAddress: true,
        noFixedAddressLink: `/order/${order.id}/contact-information/no-fixed-abode`,
      }),
    )
  })

  it('renders an existing user-entered address with the standard confirmation style', async () => {
    const primaryAddress = createAddress({
      addressLine1: '1 Washington Street',
      postcode: 'WR1 1NL',
      addressSource: 'CEMO',
    })
    const order = getMockOrder({ addresses: [primaryAddress] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: {},
    })
    const res = createMockResponse(order)

    await controller.view(req, res, jest.fn())

    expect(res.render).toHaveBeenCalledWith(
      'pages/order/postcode-lookup/confirm-address',
      expect.objectContaining({ isCorePersonRecordAddress: false }),
    )
  })

  it('stores the CPR primary address and fixed address state after confirmation', async () => {
    const primaryAddress = createAddress({
      addressLine1: '1 Washington Street',
      postcode: 'WR1 1NL',
      addressSource: 'CORE_PERSON_RECORD',
    })
    const order = getMockOrder({ addresses: [primaryAddress] })
    const req = createMockRequest({
      order,
      params: { orderId: order.id, addressType: 'PRIMARY' },
      query: {},
      body: { action: 'continue' },
    })
    const res = createMockResponse(order)
    addressService.updateAddress.mockResolvedValue(primaryAddress)
    deviceWearerService.updateNoFixedAbode.mockResolvedValue({ ...order.deviceWearer, noFixedAbode: false })

    await controller.update(req, res, jest.fn())

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
