import express from 'express'
import request from 'supertest'
import { type Services } from '../../services'
import createVariationsRouter from './router'
import VariationDetailsController from '../../controllers/variation/variationDetailsController'
import ServiceRequestTypeController from './service-request-type/controller'
import IsAddressChangeController from './is-address-change/controller'

const mockVariationDetailsController = {
  view: jest.fn((req, res) => res.status(200).send('variation-details-view')),
  update: jest.fn((req, res) => res.status(200).send('variation-details-update')),
}

const mockServiceRequestTypeController = {
  view: jest.fn((req, res) => res.status(200).send('service-request-type-view')),
  update: jest.fn((req, res) => res.status(200).send('service-request-type-update')),
}

const mockIsAddressChangeController = {
  view: jest.fn((req, res) => res.status(200).send('is-address-change-view')),
  update: jest.fn((req, res) => res.status(200).send('is-address-change-update')),
}

jest.mock('../../controllers/variation/variationDetailsController', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockVariationDetailsController),
}))

jest.mock('./service-request-type/controller', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockServiceRequestTypeController),
}))

jest.mock('./is-address-change/controller', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockIsAddressChangeController),
}))

describe('createVariationsRouter', () => {
  const services = {
    variationService: {},
    taskListService: {},
    orderChecklistService: {},
    serviceRequestTypeService: {},
  } as Pick<Services, 'variationService' | 'taskListService' | 'orderChecklistService' | 'serviceRequestTypeService'>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers the variation routes with the expected controllers', async () => {
    const app = express()

    app.use(createVariationsRouter(services))

    await request(app).get('/order/123/variation/details').expect(200, 'variation-details-view')
    await request(app).post('/order/123/variation/details').expect(200, 'variation-details-update')
    await request(app).get('/order/123/version/456/variation/details').expect(200, 'variation-details-view')
    await request(app).post('/order/123/version/456/variation/details').expect(200, 'variation-details-update')
    await request(app).get('/order/123/service-request-type').expect(200, 'service-request-type-view')
    await request(app).post('/order/123/service-request-type').expect(200, 'service-request-type-update')
    await request(app).get('/order/create-variation').expect(200, 'is-address-change-view')
    await request(app).post('/order/create-variation').expect(200, 'is-address-change-update')

    expect(VariationDetailsController).toHaveBeenCalledWith(
      services.variationService,
      services.taskListService,
      services.orderChecklistService,
    )
    expect(ServiceRequestTypeController).toHaveBeenCalledWith(services.serviceRequestTypeService)
    expect(IsAddressChangeController).toHaveBeenCalledWith(services.serviceRequestTypeService)
  })
})
