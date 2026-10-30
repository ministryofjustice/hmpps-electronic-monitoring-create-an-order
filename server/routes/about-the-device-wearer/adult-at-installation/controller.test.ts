import { NextFunction, Request, Response } from 'express'
import { createDeviceWearer, createInterestedParties, getMockOrder } from '../../../../test/mocks/mockOrder'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import { NotifyingOrganisation } from '../../../models/NotifyingOrganisation'
import RestClient from '../../../data/restClient'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import DeviceWearerStoreService from '../store/deviceWearerStoreService'
import { DeviceWearerCache } from '../store/model'
import AdultAtInstallationController from './controller'

jest.mock('../deviceWearerAnswersService')
jest.mock('../../../services/taskListService')

const VIEW = 'pages/order/about-the-device-wearer/adult-at-installation'
const ERROR = 'Select yes if a responsible adult is required'

describe('AdultAtInstallationController', () => {
  const order = getMockOrder({
    interestedParties: createInterestedParties({ notifyingOrganisation: 'YOUTH_CUSTODY_SERVICE' }),
  })
  const adultAtInstallationPath = paths.ABOUT_THE_DEVICE_WEARER.ADULT_AT_INSTALLATION.replace(':orderId', order.id)
  const answered: DeviceWearerCache = {
    firstName: 'Jo',
    lastName: 'Bloggs',
    dateOfBirth: '2010-01-01T00:00:00.000Z',
    sex: 'MALE',
    gender: 'MALE',
    disabilities: ['NONE'],
    interpreterRequired: false,
    adultAtTimeOfInstallation: false,
  }

  let service: jest.Mocked<DeviceWearerAnswersService>
  let taskListService: jest.Mocked<TaskListService>
  let controller: AdultAtInstallationController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    service = new DeviceWearerAnswersService(
      new DeviceWearerStoreService(new InMemoryStore()),
      {} as RestClient,
    ) as jest.Mocked<DeviceWearerAnswersService>
    service.getDeviceWearer.mockResolvedValue(answered)
    taskListService = new TaskListService() as jest.Mocked<TaskListService>
    taskListService.getNextPage.mockReturnValue('/next-page')
    controller = new AdultAtInstallationController(service, taskListService)

    req = createMockRequest({ order, flash: jest.fn().mockReturnValue([]) })
    res = createMockResponse()
    res.locals.isOrderEditable = true
  })

  describe('view', () => {
    it('renders the saved answer', async () => {
      await controller.view(req, res, next)

      expect(service.getDeviceWearer).toHaveBeenCalledWith(order)
      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({ adultAtTimeOfInstallation: expect.objectContaining({ value: 'false' }) }),
      )
    })

    it('renders nothing selected when the question has not been answered', async () => {
      service.getDeviceWearer.mockResolvedValue({ ...answered, adultAtTimeOfInstallation: null })

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({ adultAtTimeOfInstallation: expect.objectContaining({ value: '' }) }),
      )
    })

    it('renders the rejected answer and its errors instead of the saved answer', async () => {
      const errors = [{ field: 'adultAtTimeOfInstallation', error: ERROR }]
      req.flash = jest
        .fn()
        .mockImplementation((key: string) =>
          key === 'formData' ? [{ action: 'continue', adultAtTimeOfInstallation: '' }] : errors,
        )

      await controller.view(req, res, next)

      expect(service.getDeviceWearer).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          adultAtTimeOfInstallation: expect.objectContaining({ value: '', error: { text: ERROR } }),
          errorSummary: expect.objectContaining({ errorList: [{ text: ERROR, href: '#adultAtTimeOfInstallation' }] }),
        }),
      )
    })

    it('renders the api errors with the saved answer', async () => {
      const errors = [{ field: 'adultAtTimeOfInstallation', error: 'api error' }]
      req.flash = jest.fn().mockImplementation((key: string) => (key === 'formData' ? [] : errors))

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          adultAtTimeOfInstallation: expect.objectContaining({ value: 'false', error: { text: 'api error' } }),
        }),
      )
    })
  })

  describe('update', () => {
    it('redisplays the page with an error when no answer is selected', async () => {
      req.body = { action: 'continue' }

      await controller.update(req, res, next)

      expect(service.saveAdultAtInstallation).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('formData', { action: 'continue', adultAtTimeOfInstallation: '' })
      expect(req.flash).toHaveBeenCalledWith('validationErrors', [{ field: 'adultAtTimeOfInstallation', error: ERROR }])
      expect(res.redirect).toHaveBeenCalledWith(adultAtInstallationPath)
    })

    it.each([
      ['Yes', 'false', false],
      ['No', 'true', true],
    ])(
      'saves %s and continues to the next page in the task list',
      async (_answer, formValue, adultAtTimeOfInstallation) => {
        const submitted = { ...order.deviceWearer, adultAtTimeOfInstallation }
        service.submit.mockResolvedValue(submitted)
        req.body = { action: 'continue', adultAtTimeOfInstallation: formValue }

        await controller.update(req, res, next)

        expect(service.saveAdultAtInstallation).toHaveBeenCalledWith(order, { adultAtTimeOfInstallation })
        expect(taskListService.getNextPage).toHaveBeenCalledWith('DEVICE_WEARER', {
          ...order,
          deviceWearer: submitted,
        })
        expect(res.redirect).toHaveBeenCalledWith('/next-page')
      },
    )
  })

  describe('orders that are not asked whether a responsible adult is required', () => {
    const probationOrder = getMockOrder({
      interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
    })

    beforeEach(() => {
      req.order = probationOrder
    })

    it('does not show the question, and continues to the next page without submitting', async () => {
      await controller.view(req, res, next)

      expect(res.render).not.toHaveBeenCalled()
      expect(service.submit).not.toHaveBeenCalled()
      expect(taskListService.getNextPage).toHaveBeenCalledWith('DEVICE_WEARER', {
        ...probationOrder,
        deviceWearer: { ...probationOrder.deviceWearer, adultAtTimeOfInstallation: true },
      })
      expect(res.redirect).toHaveBeenCalledWith('/next-page')
    })

    it('does not show the question, and goes back to the first unanswered page', async () => {
      service.getDeviceWearer.mockResolvedValue({ ...answered, interpreterRequired: null })

      await controller.view(req, res, next)

      expect(res.render).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(
        paths.ABOUT_THE_DEVICE_WEARER.LANGUAGE.replace(':orderId', probationOrder.id),
      )
    })

    it('does not save a posted answer, and submits the other answers', async () => {
      service.submit.mockResolvedValue({ ...probationOrder.deviceWearer, adultAtTimeOfInstallation: true })
      req.body = { action: 'continue', adultAtTimeOfInstallation: 'false' }

      await controller.update(req, res, next)

      expect(service.saveAdultAtInstallation).not.toHaveBeenCalled()
      expect(service.submit).toHaveBeenCalledWith({ accessToken: res.locals.user.token, order: probationOrder })
      expect(res.redirect).toHaveBeenCalledWith('/next-page')
    })
  })

  describe('orders that cannot be edited', () => {
    const versionedSummaryUri = `/order/${order.id}/version/a-version-id/summary`
    const submittedOrder = getMockOrder({
      status: 'SUBMITTED',
      interestedParties: createInterestedParties({ notifyingOrganisation: 'YOUTH_COURT' }),
      deviceWearer: createDeviceWearer({ ...answered, adultAtTimeOfInstallation: true }),
    })

    beforeEach(() => {
      req.order = submittedOrder
      res.locals.isOrderEditable = false
      res.locals.orderSummaryUri = versionedSummaryUri
    })

    it('shows the submitted answer, not unsubmitted cached answers, and disables it', async () => {
      await controller.view(req, res, next)

      expect(service.getDeviceWearer).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        VIEW,
        expect.objectContaining({
          adultAtTimeOfInstallation: expect.objectContaining({
            value: 'true',
            items: [
              { value: 'false', text: 'Yes', disabled: true },
              { value: 'true', text: 'No', disabled: true },
            ],
          }),
        }),
      )
    })

    it('does not read the cache when skipping the question for other orders', async () => {
      req.order = {
        ...submittedOrder,
        interestedParties: createInterestedParties({ notifyingOrganisation: 'PROBATION' }),
      }

      await controller.view(req, res, next)

      expect(service.getDeviceWearer).not.toHaveBeenCalled()
      expect(res.render).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/next-page')
    })

    it.each<NotifyingOrganisation>(['YOUTH_COURT', 'PROBATION'])(
      'returns %s orders to the versioned order summary without saving or submitting',
      async notifyingOrganisation => {
        req.order = { ...submittedOrder, interestedParties: createInterestedParties({ notifyingOrganisation }) }
        req.body = { action: 'continue', adultAtTimeOfInstallation: 'false' }

        await controller.update(req, res, next)

        expect(res.redirect).toHaveBeenCalledWith(versionedSummaryUri)
        expect(req.flash).not.toHaveBeenCalled()
        expect(service.saveAdultAtInstallation).not.toHaveBeenCalled()
        expect(service.getDeviceWearer).not.toHaveBeenCalled()
        expect(service.submit).not.toHaveBeenCalled()
      },
    )

    it('returns to the order summary when there is no order summary uri', async () => {
      res.locals.orderSummaryUri = undefined
      req.body = { action: 'continue', adultAtTimeOfInstallation: 'false' }

      await controller.update(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith(paths.ORDER.SUMMARY.replace(':orderId', submittedOrder.id))
      expect(service.submit).not.toHaveBeenCalled()
    })
  })
})
