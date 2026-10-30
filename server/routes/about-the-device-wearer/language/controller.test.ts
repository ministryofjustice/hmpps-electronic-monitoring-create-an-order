import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import { createDeviceWearer, getMockOrder } from '../../../../test/mocks/mockOrder'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import { Order } from '../../../models/Order'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'
import LanguageController from './controller'

const view = 'pages/order/about-the-device-wearer/language'

const answeredOrder = (overrides: Partial<Order['deviceWearer']> = {}) =>
  getMockOrder({
    deviceWearer: createDeviceWearer({
      firstName: 'Jo',
      lastName: 'Bloggs',
      dateOfBirth: '1980-01-01T00:00:00.000Z',
      sex: 'MALE',
      gender: 'MALE',
      disabilities: ['VISION'],
      adultAtTimeOfInstallation: true,
      ...overrides,
    }),
  })

describe('LanguageController', () => {
  let apiClient: jest.Mocked<RestClient>
  let service: DeviceWearerAnswersService
  let controller: LanguageController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  const requestFor = (order: Order, flashed: Record<string, unknown[]> = {}) => {
    req = createMockRequest({ order, params: { orderId: order.id } })
    req.flash = jest.fn().mockImplementation((key: string) => flashed[key] ?? [])
  }

  beforeEach(() => {
    apiClient = { put: jest.fn() } as unknown as jest.Mocked<RestClient>
    service = new DeviceWearerAnswersService(new DeviceWearerStoreService(new InMemoryStore()), apiClient)
    controller = new LanguageController(service, new TaskListService())
    res = createMockResponse()
    res.locals.isOrderEditable = true
  })

  describe('view', () => {
    it('shows the answers saved on the order', async () => {
      requestFor(answeredOrder({ interpreterRequired: true, language: 'Arabic' }))

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        view,
        expect.objectContaining({
          interpreterRequired: expect.objectContaining({ value: 'true' }),
          language: expect.objectContaining({ value: 'Arabic' }),
          errorSummary: null,
        }),
      )
    })

    it('shows answers saved earlier in the journey instead of the order answers', async () => {
      const order = answeredOrder({ interpreterRequired: true, language: 'Arabic' })
      requestFor(order)
      await service.saveLanguage(order, { interpreterRequired: false, language: '' })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        view,
        expect.objectContaining({
          interpreterRequired: expect.objectContaining({ value: 'false' }),
          language: expect.objectContaining({ value: '' }),
        }),
      )
    })

    it('shows the rejected answers and errors', async () => {
      requestFor(answeredOrder({ interpreterRequired: false }), {
        formData: [{ action: 'continue', interpreterRequired: 'true', language: '' }],
        validationErrors: [{ field: 'language', error: 'Select the language required' }],
      })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        view,
        expect.objectContaining({
          interpreterRequired: expect.objectContaining({ value: 'true' }),
          language: { value: '', error: { text: 'Select the language required' } },
          errorSummary: {
            titleText: 'There is a problem',
            errorList: [{ href: '#language', text: 'Select the language required' }],
          },
        }),
      )
    })

    it('shows errors from the api against the saved answers', async () => {
      requestFor(answeredOrder({ interpreterRequired: true, language: '' }), {
        validationErrors: [{ field: 'language', error: 'Select the language required' }],
      })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        view,
        expect.objectContaining({
          interpreterRequired: expect.objectContaining({ value: 'true' }),
          language: { value: '', error: { text: 'Select the language required' } },
        }),
      )
    })

    it('disables the answers when the order cannot be edited', async () => {
      requestFor(answeredOrder({ interpreterRequired: false }))
      res.locals.isOrderEditable = false

      await controller.view(req, res, next)

      const { interpreterRequired } = (res.render as jest.Mock).mock.calls[0][1]
      expect(interpreterRequired.items).toEqual([
        expect.objectContaining({ value: 'true', disabled: true }),
        expect.objectContaining({ value: 'false', disabled: true }),
        { divider: 'or' },
        expect.objectContaining({ value: 'DONT_KNOW', text: "Don't know", disabled: true }),
      ])
    })

    it('shows the answers on the order, not answers saved earlier, when the order cannot be edited', async () => {
      const order = answeredOrder({ interpreterRequired: true, language: 'Arabic' })
      requestFor(order)
      await service.saveLanguage(order, { interpreterRequired: false, language: '' })
      res.locals.isOrderEditable = false

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        view,
        expect.objectContaining({
          interpreterRequired: expect.objectContaining({ value: 'true' }),
          language: expect.objectContaining({ value: 'Arabic' }),
        }),
      )
    })
  })

  describe('update', () => {
    it('saves nothing and returns to the order when the order cannot be edited', async () => {
      const order = answeredOrder()
      requestFor(order)
      res.locals.isOrderEditable = false
      req.body = { action: 'continue', interpreterRequired: 'true', language: 'Arabic' }

      await controller.update(req, res, next)

      expect((await service.getDeviceWearer(order)).interpreterRequired).toBeNull()
      expect(apiClient.put).not.toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    })

    it('returns to the summary of the version being viewed when the order cannot be edited', async () => {
      const order = answeredOrder()
      requestFor(order)
      res.locals.isOrderEditable = false
      res.locals.orderSummaryUri = `/order/${order.id}/version/${order.versionId}/summary`
      req.body = { action: 'continue', interpreterRequired: 'true', language: 'Arabic' }

      await controller.update(req, res, next)

      expect((await service.getDeviceWearer(order)).interpreterRequired).toBeNull()
      expect(apiClient.put).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(`/order/${order.id}/version/${order.versionId}/summary`)
    })

    it("submits don't know as no interpreter needed", async () => {
      const order = answeredOrder()
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'DONT_KNOW', language: '' }
      apiClient.put.mockResolvedValue({ ...order.deviceWearer, disabilities: 'VISION', interpreterRequired: false })

      await controller.update(req, res, next)

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ interpreterRequired: false, language: '' }) }),
      )
    })

    it('submits no language when a saved interpreter answer is changed to no', async () => {
      const order = answeredOrder({ interpreterRequired: true, language: 'Arabic' })
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'false', language: 'Arabic' }
      apiClient.put.mockResolvedValue({ ...order.deviceWearer, disabilities: 'VISION', interpreterRequired: false })

      await controller.update(req, res, next)

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ interpreterRequired: false, language: '' }) }),
      )
    })
    it('returns to the page with the errors and saves nothing when no answer is given', async () => {
      const order = answeredOrder()
      requestFor(order)
      req.body = { action: 'continue' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('formData', { action: 'continue', interpreterRequired: '', language: '' })
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({
          field: 'interpreterRequired',
          error: 'Select yes if the device wearer requires an interpreter',
        }),
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id))
      expect((await service.getDeviceWearer(order)).interpreterRequired).toBeNull()
      expect(apiClient.put).not.toHaveBeenCalled()
    })

    it('returns to the page with the errors when an interpreter is needed without a language', async () => {
      const order = answeredOrder()
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'true', language: '' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({ field: 'language', error: 'Select the language required' }),
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id))
      expect(apiClient.put).not.toHaveBeenCalled()
    })

    it('saves the answers and goes to the next unanswered device wearer page', async () => {
      const order = answeredOrder({ adultAtTimeOfInstallation: null })
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'false', language: '' }

      await controller.update(req, res, next)

      expect(await service.getDeviceWearer(order)).toEqual(
        expect.objectContaining({ interpreterRequired: false, language: '' }),
      )
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', order.id),
      )
      expect(apiClient.put).not.toHaveBeenCalled()
    })

    it('submits the device wearer and continues to the contact number page once every page is answered', async () => {
      const order = answeredOrder()
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'true', language: 'Arabic' }
      apiClient.put.mockResolvedValue({
        ...order.deviceWearer,
        disabilities: 'VISION',
        interpreterRequired: true,
        language: 'Arabic',
      })

      await controller.update(req, res, next)

      expect(apiClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${order.id}/device-wearer`,
        data: expect.objectContaining({
          firstName: 'Jo',
          disabilities: 'VISION',
          interpreterRequired: true,
          language: 'Arabic',
        }),
        token: 'fakeUserToken',
      })
      expect(res.redirect).toHaveBeenCalledWith(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', order.id))
    })

    it('returns to the page with the api errors for the language answers', async () => {
      const order = answeredOrder()
      requestFor(order)
      req.body = { action: 'continue', interpreterRequired: 'true', language: 'Arabic' }
      apiClient.put.mockRejectedValue({
        status: 400,
        data: [{ field: 'language', error: 'Select the language required' }],
      })

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        { field: 'language', error: 'Select the language required' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', order.id))
    })
  })
})
