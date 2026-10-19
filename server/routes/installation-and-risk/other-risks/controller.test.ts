import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import DetailsOfInstallationService from '../details-of-installation/service'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import OtherRisksController from './controller'

jest.mock('../../../data/restClient')
jest.mock('../../../services/taskListService')
jest.mock('../details-of-installation/service')

describe('OtherRisksController', () => {
  const nextPage = '/next-page'
  const backendErrors: ValidationResult = [{ error: 'Backend says no', field: 'riskDetails' }]

  let store: RiskAtInstallationStoreService
  let detailsOfInstallationService: jest.Mocked<DetailsOfInstallationService>
  let taskListService: jest.Mocked<TaskListService>
  let controller: OtherRisksController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    store = new RiskAtInstallationStoreService(new InMemoryStore())
    detailsOfInstallationService = new DetailsOfInstallationService(
      new RestClient('cemoApi', { url: '', timeout: { response: 0, deadline: 0 }, agent: { timeout: 0 } }),
    ) as jest.Mocked<DetailsOfInstallationService>
    detailsOfInstallationService.updateDetailsOfInstallation.mockResolvedValue({ riskCategory: [], riskDetails: '' })
    taskListService = new TaskListService() as jest.Mocked<TaskListService>
    taskListService.getNextPage.mockReturnValue(nextPage)
    controller = new OtherRisksController(store, detailsOfInstallationService, taskListService)

    req = createMockRequest()
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
  })

  describe('view', () => {
    it('renders the other risks page with no answer by default', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/other-risks',
        expect.objectContaining({
          hasOtherRisks: expect.objectContaining({ value: '' }),
          riskDetails: expect.objectContaining({ value: '' }),
        }),
      )
    })

    it('shows the cached answer', async () => {
      await store.updateField(req.order!, 'hasOtherRisks', 'YES')
      await store.updateField(req.order!, 'riskDetails', 'Aggressive neighbour')

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/other-risks',
        expect.objectContaining({
          hasOtherRisks: expect.objectContaining({ value: 'YES' }),
          riskDetails: expect.objectContaining({ value: 'Aggressive neighbour' }),
        }),
      )
    })

    it('shows the errors from submitting', async () => {
      req.flash = jest.fn().mockReturnValue(backendErrors)

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/other-risks',
        expect.objectContaining({
          errorSummary: {
            titleText: 'There is a problem',
            errorList: [{ href: '#riskDetails', text: 'Backend says no' }],
          },
        }),
      )
    })
  })

  describe('update', () => {
    const otherRisksPath = paths.INSTALLATION_AND_RISK.OTHER_RISKS

    it('returns to the page with an error when no answer is given', async () => {
      req.body = { action: 'continue' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({
          error: 'Select yes if there are any other risks to be aware of',
          field: 'hasOtherRisks',
        }),
      ])
      expect(res.redirect).toHaveBeenCalledWith(otherRisksPath.replace(':orderId', req.order!.id))
      expect(detailsOfInstallationService.updateDetailsOfInstallation).not.toHaveBeenCalled()
    })

    it('returns to the page with an error when yes has no details', async () => {
      req.body = { action: 'continue', hasOtherRisks: 'YES', riskDetails: '' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({ error: 'Enter what other risks there are', field: 'riskDetails' }),
      ])
      expect(detailsOfInstallationService.updateDetailsOfInstallation).not.toHaveBeenCalled()
    })

    it('submits the cached risks with the details', async () => {
      await store.updateField(req.order!, 'possibleRisk', ['THREATS_OF_VIOLENCE'])
      await store.updateField(req.order!, 'riskCategory', ['DANGEROUS_ANIMALS'])
      req.body = { action: 'continue', hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' }

      await controller.update(req, res, next)

      expect(detailsOfInstallationService.updateDetailsOfInstallation).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: req.order!.id,
        data: {
          possibleRisk: ['THREATS_OF_VIOLENCE'],
          riskCategory: ['DANGEROUS_ANIMALS'],
          riskDetails: 'Aggressive neighbour',
          genderRiskDetails: '',
        },
      })
    })

    it('discards the details when the answer is no', async () => {
      req.body = { action: 'continue', hasOtherRisks: 'NO', riskDetails: 'left over text' }

      await controller.update(req, res, next)

      expect(detailsOfInstallationService.updateDetailsOfInstallation).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ riskDetails: '' }) }),
      )
      expect((await store.getRiskAtInstallation(req.order!)).hasOtherRisks).toBe('NO')
    })

    it('goes to the page after details of installation', async () => {
      req.body = { action: 'continue', hasOtherRisks: 'NO' }

      await controller.update(req, res, next)

      expect(taskListService.getNextPage).toHaveBeenCalledWith('DETAILS_OF_INSTALLATION', req.order)
      expect(res.redirect).toHaveBeenCalledWith(nextPage)
    })

    it('returns to the page with the errors when the submission is rejected', async () => {
      detailsOfInstallationService.updateDetailsOfInstallation.mockResolvedValue(backendErrors)
      req.body = { action: 'continue', hasOtherRisks: 'NO' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', backendErrors)
      expect(res.redirect).toHaveBeenCalledWith(otherRisksPath.replace(':orderId', req.order!.id))
    })
  })
})
