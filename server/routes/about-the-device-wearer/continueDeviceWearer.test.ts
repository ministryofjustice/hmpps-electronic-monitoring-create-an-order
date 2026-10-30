import { Request, Response } from 'express'
import { getMockOrder } from '../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../test/mocks/mockExpress'
import paths from '../../constants/paths'
import { ValidationResult } from '../../models/Validation'
import TaskListService from '../../services/taskListService'
import continueDeviceWearer from './continueDeviceWearer'
import DeviceWearerAnswersService from './deviceWearerAnswersService'
import { DeviceWearerCache } from './store/model'

const answered: DeviceWearerCache = {
  firstName: 'Jo',
  lastName: 'Bloggs',
  dateOfBirth: '1980-01-01T00:00:00.000Z',
  sex: 'MALE',
  gender: 'MALE',
  disabilities: ['VISION'],
  interpreterRequired: false,
  adultAtTimeOfInstallation: true,
}

describe('continueDeviceWearer', () => {
  const order = getMockOrder()
  const currentPath = '/current'
  let req: Request
  let res: Response
  let service: jest.Mocked<DeviceWearerAnswersService>
  let taskListService: jest.Mocked<TaskListService>

  beforeEach(() => {
    req = createMockRequest({ order, flash: jest.fn() })
    res = createMockResponse()
    service = { getDeviceWearer: jest.fn(), submit: jest.fn() } as unknown as jest.Mocked<DeviceWearerAnswersService>
    taskListService = { getNextPage: jest.fn().mockReturnValue('/next') } as unknown as jest.Mocked<TaskListService>
  })

  it('redirects to the first unanswered page without submitting', async () => {
    service.getDeviceWearer.mockResolvedValue({ ...answered, interpreterRequired: null })

    await continueDeviceWearer(req, res, service, taskListService, currentPath)

    expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id))
    expect(service.submit).not.toHaveBeenCalled()
  })

  it('redirects to the page that owns an api validation error', async () => {
    const errors: ValidationResult = [{ field: 'disabilities', error: 'x' }]
    service.getDeviceWearer.mockResolvedValue(answered)
    service.submit.mockResolvedValue(errors)

    await continueDeviceWearer(req, res, service, taskListService, currentPath)

    expect(req.flash).toHaveBeenCalledWith('validationErrors', errors)
    expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', order.id))
  })

  it('goes to the next page once submitted', async () => {
    service.getDeviceWearer.mockResolvedValue(answered)
    service.submit.mockResolvedValue(order.deviceWearer)

    await continueDeviceWearer(req, res, service, taskListService, currentPath)

    expect(res.redirect).toHaveBeenCalledWith('/next')
  })
})
