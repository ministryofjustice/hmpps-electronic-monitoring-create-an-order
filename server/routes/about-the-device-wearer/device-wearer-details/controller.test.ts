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
import DeviceWearerDetailsController from './controller'

const VIEW = 'pages/order/about-the-device-wearer/device-wearer-details'

const validBody = {
  action: 'continue',
  firstName: ' Jane ',
  middleName: 'Ann',
  lastName: 'Example',
  alias: 'Janey',
  dateOfBirth: { day: '4', month: '3', year: '1990' },
  sex: 'FEMALE',
  gender: 'NON_BINARY',
}

describe('DeviceWearerDetailsController', () => {
  let order: Order
  let storeService: DeviceWearerStoreService
  let apiClient: jest.Mocked<RestClient>
  let taskListService: jest.Mocked<TaskListService>
  let controller: DeviceWearerDetailsController
  let flashed: Record<string, unknown[]>

  const request = (overrides: Partial<Request> = {}): Request =>
    createMockRequest({
      order,
      params: { orderId: order.id },
      body: {},
      // Behaves like connect-flash: arrays are spread into the messages and reading consumes them
      flash: jest.fn((key: string, value?: unknown) => {
        if (value === undefined) {
          const messages = flashed[key] ?? []
          delete flashed[key]
          return messages
        }
        flashed[key] = [...(flashed[key] ?? []), ...(Array.isArray(value) ? value : [value])]
        return flashed[key].length
      }) as unknown as Request['flash'],
      ...overrides,
    })

  const response = (isOrderEditable = true): Response => {
    const res = createMockResponse()
    res.locals.isOrderEditable = isOrderEditable
    return res
  }

  beforeEach(() => {
    order = getMockOrder({
      deviceWearer: createDeviceWearer({ firstName: 'Saved', lastName: 'Person', sex: 'MALE', gender: 'MALE' }),
    })
    storeService = new DeviceWearerStoreService(new InMemoryStore())
    apiClient = { put: jest.fn() } as unknown as jest.Mocked<RestClient>
    taskListService = {
      getNextPage: jest.fn().mockReturnValue('/next-section'),
    } as unknown as jest.Mocked<TaskListService>
    controller = new DeviceWearerDetailsController(
      new DeviceWearerAnswersService(storeService, apiClient),
      taskListService,
    )
    flashed = {}
  })

  describe('view', () => {
    it('renders the personal details page prefilled from the order', async () => {
      const res = response()

      await controller.view(request(), res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          firstName: { value: 'Saved' },
          lastName: { value: 'Person' },
          sex: { value: 'MALE' },
          gender: { value: 'MALE' },
          errorSummary: null,
        }),
      )
    })

    it('prefers answers already saved in this journey', async () => {
      await storeService.updateDeviceWearer(order, { firstName: 'Cached' })
      const res = response()

      await controller.view(request(), res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(VIEW, expect.objectContaining({ firstName: { value: 'Cached' } }))
    })

    it('does not show answers saved against a different version of the order', async () => {
      await storeService.updateDeviceWearer({ ...order, versionId: 'another-version' }, { firstName: 'Other' })
      const res = response()

      await controller.view(request(), res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(VIEW, expect.objectContaining({ firstName: { value: 'Saved' } }))
    })

    it('shows the order answers, not unsent journey answers, when the order cannot be edited', async () => {
      await storeService.updateDeviceWearer(order, { firstName: 'Unsent' })
      const res = response(false)

      await controller.view(request(), res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(VIEW, expect.objectContaining({ firstName: { value: 'Saved' } }))
    })

    it('shows the order values when the order has changed since answers were saved', async () => {
      await controller.update(request({ body: { ...validBody, firstName: 'Journey' } }), response(), jest.fn())
      // e.g. a CPR lookup or another session updated the device wearer through the API
      order = { ...order, deviceWearer: { ...order.deviceWearer, firstName: 'Updated via API' } }
      const res = response()

      await controller.view(request(), res, jest.fn())

      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({ firstName: { value: 'Updated via API' } }),
      )
    })

    it('shows an error from the API against the saved answers', async () => {
      order = getMockOrder({
        deviceWearer: createDeviceWearer({
          disabilities: ['NONE'],
          interpreterRequired: false,
          adultAtTimeOfInstallation: true,
        }),
      })
      apiClient.put.mockRejectedValue({
        status: 400,
        data: [{ field: 'dateOfBirth', error: 'Date of birth must be in the past' }],
      })

      const updateRes = response()
      await controller.update(request({ body: validBody }), updateRes, jest.fn())

      expect(updateRes.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
      )

      const viewRes = response()
      await controller.view(request(), viewRes, jest.fn())

      expect(viewRes.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          firstName: { value: 'Jane' },
          dateOfBirth: {
            value: { day: '04', month: '03', year: '1990' },
            error: { text: 'Date of birth must be in the past' },
          },
          errorSummary: {
            titleText: 'There is a problem',
            errorList: [{ text: 'Date of birth must be in the past', href: '#dateOfBirth-day' }],
          },
        }),
      )
    })

    it('selects no sex option for a legacy "Prefer not to say" answer, so the user must choose again', async () => {
      order = getMockOrder({ deviceWearer: createDeviceWearer({ sex: 'PREFER_NOT_TO_SAY' }) })
      const res = response()

      await controller.view(request(), res, jest.fn())

      // The value is passed through, but the page no longer offers it so no radio is checked (see view.test.ts)
      expect(res.render).toHaveBeenCalledWith(VIEW, expect.objectContaining({ sex: { value: 'PREFER_NOT_TO_SAY' } }))

      const updateRes = response()
      await controller.update(request({ body: { ...validBody, sex: undefined } }), updateRes, jest.fn())

      expect(flashed.validationErrors).toEqual([
        { field: 'sex', error: "Select the device wearer's sex, or select 'Not able to provide this information'" },
      ])
    })
  })

  describe('update', () => {
    it('returns to the order summary for the version being viewed without saving when the order cannot be edited', async () => {
      const versionSummaryUri = `/order/${order.id}/version/${order.versionId}/summary`
      const res = response(false)
      res.locals.orderSummaryUri = versionSummaryUri
      const req = request({ body: validBody })

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(versionSummaryUri)
      expect(req.flash).not.toHaveBeenCalled()
      expect(apiClient.put).not.toHaveBeenCalled()
      expect((await storeService.getDeviceWearer(order)).firstName).toEqual('Saved')
    })

    it('falls back to the order summary when there is no summary link for the order', async () => {
      const res = response(false)

      await controller.update(request({ body: validBody }), res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    })
    it('redisplays the page with the existing validation errors when nothing is entered', async () => {
      const res = response()
      const req = request({ body: { action: 'continue', dateOfBirth: { day: '', month: '', year: '' } } })

      await controller.update(req, res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_DETAILS.replace(':orderId', order.id),
      )
      expect(flashed.validationErrors).toEqual([
        { field: 'firstName', error: "Enter device wearer's first name" },
        { field: 'lastName', error: "Enter device wearer's last name" },
        { field: 'dateOfBirth', error: 'Enter date of birth', focusTarget: 'dateOfBirth-day' },
        { field: 'sex', error: "Select the device wearer's sex, or select 'Not able to provide this information'" },
        {
          field: 'gender',
          error: "Select the device wearer's gender, or select 'Not able to provide this information'",
        },
      ])
      expect((await storeService.getDeviceWearer(order)).firstName).toEqual('Saved')
    })

    it('redisplays the entered values after a validation error', async () => {
      const res = response()
      const body = { ...validBody, dateOfBirth: { day: '4', month: '', year: '1990' } }

      await controller.update(request({ body }), res, jest.fn())

      expect(flashed.validationErrors).toEqual([
        { field: 'dateOfBirth', error: 'Date of birth must include a month', focusTarget: 'dateOfBirth-month' },
      ])

      const viewRes = response()
      await controller.view(request(), viewRes, jest.fn())
      expect(viewRes.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          firstName: { value: 'Jane' },
          sex: { value: 'FEMALE' },
          dateOfBirth: { value: { day: '4', month: '', year: '1990' }, error: expect.anything() },
        }),
      )
    })

    it('keeps the existing name length and date of birth rules', async () => {
      const longName = 'a'.repeat(201)
      const body = {
        ...validBody,
        firstName: longName,
        middleName: longName,
        lastName: longName,
        alias: longName,
        dateOfBirth: { day: '1', month: '1', year: '2200' },
      }

      await controller.update(request({ body }), response(), jest.fn())

      expect(flashed.validationErrors).toEqual([
        { field: 'firstName', error: 'First name must be 200 characters or less' },
        { field: 'middleName', error: 'Middle name must be 200 characters or less' },
        { field: 'lastName', error: 'Last name must be 200 characters or less' },
        { field: 'alias', error: 'Preferred name must be 200 characters or less' },
        { field: 'dateOfBirth', error: 'Date of birth must be in the past', focusTarget: 'dateOfBirth-day' },
      ])
    })

    it('saves the answers and continues to the disability and health conditions page', async () => {
      const res = response()

      await controller.update(request({ body: validBody }), res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', order.id),
      )
      expect(await storeService.getDeviceWearer(order)).toEqual(
        expect.objectContaining({
          firstName: 'Jane',
          middleName: 'Ann',
          lastName: 'Example',
          alias: 'Janey',
          dateOfBirth: '1990-03-04T00:00:00.000Z',
          sex: 'FEMALE',
          gender: 'NON_BINARY',
        }),
      )
      expect(apiClient.put).not.toHaveBeenCalled()
    })

    it('submits only the fields the device wearer pages own when every page has been answered', async () => {
      order = getMockOrder({
        deviceWearer: createDeviceWearer({
          nomisId: 'A1234BC',
          pncId: '1991/0078050W',
          noFixedAbode: false,
          disabilities: ['NONE'],
          otherDisability: null,
          interpreterRequired: true,
          language: 'Welsh',
          adultAtTimeOfInstallation: true,
        }),
      })
      apiClient.put.mockResolvedValue({ ...createDeviceWearer(), disabilities: 'NONE' })
      const res = response()

      await controller.update(request({ body: validBody }), res, jest.fn())

      expect(apiClient.put).toHaveBeenCalledWith({
        path: `/api/orders/${order.id}/device-wearer`,
        token: 'fakeUserToken',
        data: {
          firstName: 'Jane',
          middleName: 'Ann',
          lastName: 'Example',
          alias: 'Janey',
          dateOfBirth: '1990-03-04T00:00:00.000Z',
          sex: 'FEMALE',
          gender: 'NON_BINARY',
          disabilities: 'NONE',
          otherDisability: null,
          interpreterRequired: true,
          language: 'Welsh',
          adultAtTimeOfInstallation: true,
        },
      })
      expect(res.redirect).toHaveBeenCalledWith('/next-section')
    })

    it('always continues through the journey, as the page has no save as draft option', async () => {
      const res = response()

      await controller.update(request({ body: { ...validBody, action: 'back' } }), res, jest.fn())

      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.DISABILITIES.replace(':orderId', order.id),
      )
    })
  })
})
