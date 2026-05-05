import paths from '../../../constants/paths'
import TaskListService from '../../../services/taskListService'
import { validationErrors } from '../../../constants/validationErrors'
import { createAddress, getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import AddressListController from './controller'

describe('AddressListController', () => {
  const mockTaskService = {
    getNextPage: jest.fn().mockReturnValue('/next-page'),
  } as unknown as jest.Mocked<TaskListService>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('update', () => {
    it('should require an answer when there are fewer than three device wearer addresses', async () => {
      // Given
      const order = getMockOrder({
        addresses: [
          createAddress({ addressType: 'PRIMARY' }),
          createAddress({ addressType: 'SECONDARY' }),
          createAddress({ addressType: 'INSTALLATION' }),
        ],
      })
      const req = createMockRequest({
        order,
        body: {},
        flash: jest.fn(),
      })
      const res = createMockResponse()
      const controller = new AddressListController(mockTaskService)

      // When
      await controller.update(req, res, jest.fn())

      // Then
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: validationErrors.postcodeLookup.addAnotherRequired,
          field: 'addAnother',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.POSTCODE_LOOKUP.ADDRESS_LIST.replace(':orderId', order.id))
    })

    it('should route to tertiary address when adding another address and installation address also exists', async () => {
      // Given
      const order = getMockOrder({
        addresses: [
          createAddress({ addressType: 'PRIMARY' }),
          createAddress({ addressType: 'SECONDARY' }),
          createAddress({ addressType: 'INSTALLATION' }),
        ],
      })
      const req = createMockRequest({
        order,
        body: { addAnother: 'true' },
      })
      const res = createMockResponse()
      const controller = new AddressListController(mockTaskService)

      // When
      await controller.update(req, res, jest.fn())

      // Then
      expect(res.redirect).toHaveBeenCalledWith(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', 'TERTIARY'),
      )
    })
  })
})
