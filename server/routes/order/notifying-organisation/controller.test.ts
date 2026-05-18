import type { NextFunction, Request, Response } from 'express'
import { getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import InterestedPartiesStoreService from '../../interested-parties/interestedPartiesStoreService'
import OrderNotifyingOrganisationController from './controller'
import { Order } from '../../../models/Order'

describe('OrderNotifyingOrganisationController', () => {
  let mockOrder: Order
  let req: Request
  let res: Response
  let next: NextFunction
  let mockInterestedPartiesStoreService: jest.Mocked<InterestedPartiesStoreService>
  let controller: OrderNotifyingOrganisationController

  beforeEach(() => {
    mockOrder = getMockOrder()
    mockInterestedPartiesStoreService = {
      getInterestedParties: jest.fn(),
      updateNotifyingOrganisation: jest.fn(),
    } as unknown as jest.Mocked<InterestedPartiesStoreService>
    controller = new OrderNotifyingOrganisationController(mockInterestedPartiesStoreService)

    req = createMockRequest({
      order: mockOrder,
      flash: jest.fn().mockReturnValue([]),
    })
    res = createMockResponse(mockOrder)
    next = jest.fn()
  })

  describe('view', () => {
    it('should render the notifying organisation page as Your details', async () => {
      // Given
      mockInterestedPartiesStoreService.getInterestedParties.mockResolvedValue({})

      // When
      await controller.view(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/interested-parties/notifying-organisation',
        expect.objectContaining({
          isOrderNotifyingOrganisationPage: true,
        }),
      )
    })
  })

  describe('update', () => {
    it('should redirect back and flash validation errors when the submitted data is invalid', async () => {
      // Given
      req.body = {
        action: 'continue',
        notifyingOrganisationEmail: '',
      }
      req.flash = jest.fn()

      // When
      await controller.update(req, res, next)

      // Then
      expect(mockInterestedPartiesStoreService.updateNotifyingOrganisation).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        {
          error: 'Select the organisation you are apart of',
          field: 'notifyingOrganisation',
        },
        {
          error: "Enter your team's email address",
          field: 'notifyingOrganisationEmail',
        },
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.NOTIFYING_ORGANISATION.replace(':orderId', mockOrder.id))
    })

    it('should store notifying organisation details and redirect to the task list', async () => {
      // Given
      req.body = {
        action: 'continue',
        notifyingOrganisation: 'PRISON',
        prison: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@b.com',
      }

      // When
      await controller.update(req, res, next)

      // Then
      expect(mockInterestedPartiesStoreService.updateNotifyingOrganisation).toHaveBeenCalledWith(mockOrder, {
        notifyingOrganisation: 'PRISON',
        notifyingOrganisationName: 'ALTCOURSE_PRISON',
        notifyingOrganisationEmail: 'prison@b.com',
      })
      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', mockOrder.id))
    })
  })
})
