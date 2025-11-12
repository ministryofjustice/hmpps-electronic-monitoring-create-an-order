import { Request, Response } from 'express'
import RemoveMonitoringTypeController from './controller'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'

describe('remove monitoring type controller', () => {
  describe('view', () => {
    let req: Request
    let res: Response
    const controller = new RemoveMonitoringTypeController()
    beforeEach(() => {
      req = createMockRequest()
      res = createMockResponse()
      res.status = jest.fn(() => res)

      req.order!.curfewConditions = {
        startDate: '2024-11-11T00:00:00Z',
        endDate: '2024-11-11T00:00:00Z',
        curfewAddress: null,
        curfewAdditionalDetails: null,
        id: 'some id',
      }
      req.params = {
        monitoringTypeId: 'some id',
      }
    })
    it('renders the correct page', async () => {
      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/monitoring-conditions/remove-monitoring-type',
        expect.anything(),
      )
    })

    it('constructs the correct model', async () => {
      await controller.view(req, res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(expect.anything(), {
        monitoringTypeText: 'Curfew from 11/11/2024 to 11/11/2024',
      })
    })

    it('returns a bad request if monitoring types id doesnt match', async () => {
      req.params = {
        monitoringTypeId: 'some other id',
      }

      await controller.view(req, res, jest.fn())

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith('No matching monitoring type: some other id')
    })
  })
})
