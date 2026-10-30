import { Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import { Order } from '../../../models/Order'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'
import DisabilitiesController from './controller'

const requiredError = 'Select if the device wearer has any disability or health conditions'

const personalDetailsAnswered = createDeviceWearer({
  firstName: 'Jo',
  lastName: 'Bloggs',
  dateOfBirth: '1980-01-01T00:00:00.000Z',
  sex: 'FEMALE',
  gender: 'FEMALE',
})

const flashWith =
  (values: Record<string, unknown[]> = {}) =>
  (key: string) =>
    values[key] ?? []

describe('DisabilitiesController', () => {
  let order: Order
  let apiClient: jest.Mocked<RestClient>
  let storeService: DeviceWearerStoreService
  let taskListService: jest.Mocked<TaskListService>
  let controller: DisabilitiesController
  let res: Response
  const next = jest.fn()

  const createRequest = (body: Record<string, unknown> = {}, flash: Record<string, unknown[]> = {}): Request =>
    createMockRequest({
      order,
      params: { orderId: order.id },
      body,
      flash: jest.fn().mockImplementation(flashWith(flash)),
    })

  beforeEach(() => {
    order = getMockOrder({ deviceWearer: { ...personalDetailsAnswered } })
    apiClient = { put: jest.fn() } as unknown as jest.Mocked<RestClient>
    storeService = new DeviceWearerStoreService(new InMemoryStore())
    taskListService = { getNextPage: jest.fn().mockReturnValue('/next') } as unknown as jest.Mocked<TaskListService>
    controller = new DisabilitiesController(new DeviceWearerAnswersService(storeService, apiClient), taskListService)
    res = createMockResponse()
    res.locals.isOrderEditable = true
  })

  describe('view', () => {
    it('renders the saved answers from the order', async () => {
      order.deviceWearer.disabilities = ['VISION', 'MOBILITY']

      await controller.view(createRequest(), res, next)

      expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/disabilities', {
        disabilities: { values: ['VISION', 'MOBILITY'] },
        otherDisability: { value: '' },
        errorSummary: null,
      })
    })

    it('prefers answers already in the cache over the order', async () => {
      await controller.update(createRequest({ disabilities: 'HEARING' }), res, next)

      await controller.view(createRequest(), res, next)

      expect(res.render).toHaveBeenLastCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({ disabilities: { values: ['HEARING'] } }),
      )
    })

    it('redisplays submitted values with validation errors', async () => {
      order.deviceWearer.disabilities = ['VISION']
      const errors = [{ field: 'disabilities', error: requiredError }]

      await controller.view(
        createRequest({}, { validationErrors: errors, formData: [{ disabilities: [] }] }),
        res,
        next,
      )

      expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/disabilities', {
        disabilities: { values: [], error: { text: requiredError } },
        otherDisability: { value: '' },
        errorSummary: { titleText: 'There is a problem', errorList: [{ href: '#disabilities', text: requiredError }] },
      })
    })

    it('prefills the saved description and prefers the cached description on revisiting', async () => {
      order.deviceWearer.disabilities = ['OTHER']
      order.deviceWearer.otherDisability = 'Existing description'

      await controller.view(createRequest(), res, next)

      expect(res.render).toHaveBeenLastCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({ otherDisability: { value: 'Existing description' } }),
      )

      await controller.update(
        createRequest({ disabilities: 'OTHER', otherDisability: 'Cached description' }),
        res,
        next,
      )
      await controller.view(createRequest(), res, next)

      expect(res.render).toHaveBeenLastCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({ otherDisability: { value: 'Cached description' } }),
      )
    })

    it('redisplays a submitted blank description instead of the saved description', async () => {
      order.deviceWearer.otherDisability = 'Existing description'
      const error = "Enter the device wearer's disability or health condition"

      await controller.view(
        createRequest(
          {},
          {
            validationErrors: [{ field: 'otherDisability', error }],
            formData: [{ disabilities: ['OTHER'], otherDisability: '' }],
          },
        ),
        res,
        next,
      )

      expect(res.render).toHaveBeenCalledWith('pages/order/about-the-device-wearer/disabilities', {
        disabilities: { values: ['OTHER'] },
        otherDisability: { value: '', error: { text: error } },
        errorSummary: { titleText: 'There is a problem', errorList: [{ href: '#otherDisability', text: error }] },
      })
    })

    it('shows the saved description alongside an API error', async () => {
      order.deviceWearer.disabilities = ['OTHER']
      order.deviceWearer.otherDisability = 'Existing description'

      await controller.view(
        createRequest({}, { validationErrors: [{ field: 'otherDisability', error: 'Invalid description' }] }),
        res,
        next,
      )

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({
          otherDisability: { value: 'Existing description', error: { text: 'Invalid description' } },
        }),
      )
    })

    it('shows the saved answers alongside errors returned from the api', async () => {
      order.deviceWearer.disabilities = ['VISION']
      const errors = [{ field: 'disabilities', error: 'Invalid disabilities' }]

      await controller.view(createRequest({}, { validationErrors: errors }), res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({
          disabilities: { values: ['VISION'], error: { text: 'Invalid disabilities' } },
        }),
      )
    })
  })

  describe('update', () => {
    it('saves the answer and continues to the language page', async () => {
      const req = createRequest({ disabilities: ['MENTAL_HEALTH', 'MEMORY'] })

      await controller.update(req, res, next)

      expect((await storeService.getDeviceWearer(order)).disabilities).toEqual(['MENTAL_HEALTH', 'MEMORY'])
      expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id))
      expect(apiClient.put).not.toHaveBeenCalled()
    })

    it('redisplays the page with an error when nothing is selected', async () => {
      order.deviceWearer.disabilities = ['VISION']
      const req = createRequest({})

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({ field: 'disabilities', error: requiredError }),
      ])
      expect(req.flash).toHaveBeenCalledWith('formData', { disabilities: [], otherDisability: '' })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', order.id),
      )
      expect((await storeService.getDeviceWearer(order)).disabilities).toEqual(['VISION'])
    })

    it('saves a posted unlisted condition description', async () => {
      order.deviceWearer.disabilities = ['OTHER']
      order.deviceWearer.otherDisability = 'Existing description'
      const req = createRequest({ disabilities: 'OTHER', otherDisability: 'Posted description' })

      await controller.update(req, res, next)

      const cached = await storeService.getDeviceWearer(order)
      expect(cached.disabilities).toEqual(['OTHER'])
      expect(cached.otherDisability).toEqual('Posted description')
    })

    it.each(['', '   '])('rejects a blank description when OTHER is selected: %p', async otherDisability => {
      const req = createRequest({ disabilities: 'OTHER', otherDisability })

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({
          field: 'otherDisability',
          error: "Enter the device wearer's disability or health condition",
        }),
      ])
      expect(req.flash).toHaveBeenCalledWith('formData', { disabilities: ['OTHER'], otherDisability })
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', order.id),
      )
      expect(apiClient.put).not.toHaveBeenCalled()
      expect((await storeService.getDeviceWearer(order)).disabilities).toEqual([])
    })

    it('clears the description when OTHER is unselected', async () => {
      order.deviceWearer.otherDisability = 'Existing description'

      await controller.update(
        createRequest({ disabilities: 'HEARING', otherDisability: 'Stale description' }),
        res,
        next,
      )

      expect((await storeService.getDeviceWearer(order)).otherDisability).toEqual('')
    })

    it('submits instead of going to the language page when language has already been answered', async () => {
      order.deviceWearer = { ...order.deviceWearer, interpreterRequired: false, adultAtTimeOfInstallation: true }
      apiClient.put.mockResolvedValue({ ...order.deviceWearer, disabilities: 'NONE' })

      await controller.update(createRequest({ disabilities: 'NONE' }), res, next)

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.objectContaining({
          path: `/api/orders/${order.id}/device-wearer`,
          data: expect.objectContaining({ disabilities: 'NONE' }),
        }),
      )
      expect(res.redirect).toHaveBeenCalledWith('/next')
      expect(res.redirect).not.toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id),
      )
    })

    it('submits the posted unlisted condition description when all pages are answered', async () => {
      order.deviceWearer = { ...order.deviceWearer, interpreterRequired: false, adultAtTimeOfInstallation: true }
      apiClient.put.mockResolvedValue({ ...order.deviceWearer, disabilities: 'OTHER', otherDisability: 'Broken arm' })

      await controller.update(createRequest({ disabilities: 'OTHER', otherDisability: 'Broken arm' }), res, next)

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ disabilities: 'OTHER', otherDisability: 'Broken arm' }),
        }),
      )
      expect(res.redirect).toHaveBeenCalledWith('/next')
    })

    it('keeps the existing description when an OTHER answer is posted without a description', async () => {
      order.deviceWearer = {
        ...order.deviceWearer,
        disabilities: ['OTHER'],
        otherDisability: 'Existing description',
        interpreterRequired: false,
        adultAtTimeOfInstallation: true,
      }
      await controller.update(createRequest({ disabilities: 'OTHER' }), res, next)

      expect(apiClient.put).not.toHaveBeenCalled()
      expect((await storeService.getDeviceWearer(order)).otherDisability).toEqual('Existing description')
    })
  })

  describe('when the order is not editable', () => {
    const versionedSummaryUri = (id: string) => `/order/${id}/version/a-version-id/summary`

    beforeEach(() => {
      res.locals.isOrderEditable = false
    })

    it('shows the answers from the order rather than the cache', async () => {
      await storeService.updateDeviceWearer(order, { disabilities: ['HEARING'] })
      order.deviceWearer.disabilities = ['VISION']

      await controller.view(createRequest(), res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/about-the-device-wearer/disabilities',
        expect.objectContaining({ disabilities: { values: ['VISION'] } }),
      )
    })

    it('returns to the versioned order summary without saving, flashing or submitting', async () => {
      order.deviceWearer = { ...order.deviceWearer, interpreterRequired: false, adultAtTimeOfInstallation: true }
      res.locals.orderSummaryUri = versionedSummaryUri(order.id)
      const req = createRequest({ disabilities: 'HEARING' })

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(versionedSummaryUri(order.id))
      expect(req.flash).not.toHaveBeenCalled()
      expect(apiClient.put).not.toHaveBeenCalled()
      expect((await storeService.getDeviceWearer(order)).disabilities).toEqual([])
    })

    it('falls back to the order summary path when no summary uri is set', async () => {
      const req = createRequest({})

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', order.id))
      expect(req.flash).not.toHaveBeenCalled()
    })
  })
})
