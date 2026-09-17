import MappaController from './controller'
import MappaService from './service'
import TaskListService from '../../../services/taskListService'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { getMockOrder } from '../../../../test/mocks/mockOrder'

jest.mock('./service')

describe('MappaController', () => {
  it('uses the submitted MAPPA data when finding the next page', async () => {
    const order = getMockOrder()
    const service = {
      updateMappa: jest.fn().mockResolvedValue({ level: 'MAPPA_ONE', category: 'CATEGORY_ONE' }),
    } as unknown as jest.Mocked<MappaService>
    const taskListService = {
      getNextPage: jest.fn().mockReturnValue('/order/test/installation-and-risk/check-your-answers'),
    } as unknown as jest.Mocked<TaskListService>
    const controller = new MappaController(service, taskListService)
    const req = createMockRequest({
      order,
      body: { action: 'continue', level: 'MAPPA 1', category: 'Category 1' },
    })
    const res = createMockResponse(order)

    await controller.update(req, res, jest.fn())

    expect(taskListService.getNextPage).toHaveBeenCalledWith('MAPPA', order)
    expect(order.mappa).toEqual({ level: 'MAPPA_ONE', category: 'CATEGORY_ONE' })
    expect(res.redirect).toHaveBeenCalledWith('/order/test/installation-and-risk/check-your-answers')
  })
})
