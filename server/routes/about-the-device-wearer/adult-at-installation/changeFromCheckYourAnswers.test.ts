import { NextFunction } from 'express'
import {
  createDeviceWearer,
  createInterestedParties,
  createResponsibleAdult,
  getMockOrder,
} from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'
import AdultAtInstallationController from './controller'

jest.mock('../../../data/restClient')

describe('Changing the responsible adult question from check your answers', () => {
  // Synthetic order saved by the old single device wearer page, before the other new pages are released
  const order = getMockOrder({
    interestedParties: createInterestedParties({ notifyingOrganisation: 'YOUTH_COURT' }),
    deviceWearer: createDeviceWearer({
      firstName: 'Test',
      lastName: 'Wearer',
      dateOfBirth: '2010-01-01T00:00:00.000Z',
      sex: 'MALE',
      gender: 'MALE',
      disabilities: ['NONE'],
      interpreterRequired: false,
      language: '',
      adultAtTimeOfInstallation: false,
    }),
    deviceWearerResponsibleAdult: createResponsibleAdult({ relationship: 'parent', fullName: 'Parent Name' }),
  })
  const next: NextFunction = jest.fn()
  let apiClient: jest.Mocked<RestClient>
  let controller: AdultAtInstallationController

  beforeEach(() => {
    apiClient = new RestClient('cemoApi', {
      url: '',
      timeout: { response: 0, deadline: 0 },
      agent: { timeout: 0 },
    }) as jest.Mocked<RestClient>
    apiClient.put.mockImplementation(async ({ data }) => ({
      ...createDeviceWearer(),
      ...(data as object),
    }))
    const service = new DeviceWearerAnswersService(new DeviceWearerStoreService(new InMemoryStore()), apiClient)
    controller = new AdultAtInstallationController(service, new TaskListService())
  })

  it('shows the saved answer, then submits No without visiting the other device wearer pages', async () => {
    const viewRes = createMockResponse()
    viewRes.locals.isOrderEditable = true
    await controller.view(createMockRequest({ order, flash: jest.fn().mockReturnValue([]) }), viewRes, next)

    expect(viewRes.render).toHaveBeenCalledWith(
      'pages/order/about-the-device-wearer/adult-at-installation',
      expect.objectContaining({ adultAtTimeOfInstallation: expect.objectContaining({ value: 'false' }) }),
    )

    const req = createMockRequest({
      order,
      flash: jest.fn(),
      body: { action: 'continue', adultAtTimeOfInstallation: 'true' },
    })
    const res = createMockResponse()
    res.locals.isOrderEditable = true
    await controller.update(req, res, next)

    expect(apiClient.put).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/api/orders/${order.id}/device-wearer`,
        data: expect.objectContaining({ adultAtTimeOfInstallation: true, disabilities: 'NONE' }),
      }),
    )
    expect(res.redirect).toHaveBeenCalledWith(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id))
  })

  it('skips the question for other orders that the old page saved as needing a responsible adult', async () => {
    const probationOrder = {
      ...order,
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
      deviceWearerResponsibleAdult: null,
    }
    const res = createMockResponse()
    res.locals.isOrderEditable = true

    await controller.view(createMockRequest({ order: probationOrder, flash: jest.fn().mockReturnValue([]) }), res, next)

    expect(res.render).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', probationOrder.id),
    )
  })
})
