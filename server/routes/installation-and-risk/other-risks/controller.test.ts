import { NextFunction, Request, Response } from 'express'
import { createMockRequest, createMockResponse } from '../../../../test/mocks/mockExpress'
import paths from '../../../constants/paths'
import RestClient from '../../../data/restClient'
import { ValidationResult } from '../../../models/Validation'
import TaskListService from '../../../services/taskListService'
import InMemoryStore from '../../store/inMemoryStore'
import { RiskAtInstallation } from '../riskAtInstallationModel'
import RiskAtInstallationService from '../riskAtInstallationService'
import RiskAtInstallationStoreService from '../riskAtInstallationStoreService'
import OtherRisksController from './controller'

jest.mock('../riskAtInstallationService')
jest.mock('../../../services/taskListService')

describe('OtherRisksController', () => {
  const nextPage = '/next-page'
  const otherRisksPath = paths.INSTALLATION_AND_RISK.OTHER_RISKS
  const answers: RiskAtInstallation = {
    possibleRisk: [],
    riskCategory: [],
    riskDetails: 'Aggressive neighbour',
    hasOtherRisks: 'YES',
    genderRiskDetails: '',
  }

  let service: jest.Mocked<RiskAtInstallationService>
  let taskListService: jest.Mocked<TaskListService>
  let controller: OtherRisksController
  let req: Request
  let res: Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    service = new RiskAtInstallationService(
      new RiskAtInstallationStoreService(new InMemoryStore()),
      {} as RestClient,
    ) as jest.Mocked<RiskAtInstallationService>
    service.getRiskAtInstallation.mockResolvedValue(answers)
    service.submit.mockResolvedValue({ riskCategory: [], riskDetails: '' })
    taskListService = new TaskListService() as jest.Mocked<TaskListService>
    taskListService.getNextPage.mockReturnValue(nextPage)
    controller = new OtherRisksController(service, taskListService)

    req = createMockRequest()
    req.flash = jest.fn().mockReturnValue([])
    res = createMockResponse()
  })

  describe('view', () => {
    it('renders the saved answers', async () => {
      await controller.view(req, res, next)

      expect(service.getRiskAtInstallation).toHaveBeenCalledWith(req.order)
      expect(res.render).toHaveBeenCalledWith(
        'pages/order/installation-and-risk/other-risks',
        expect.objectContaining({
          hasOtherRisks: expect.objectContaining({ value: 'YES' }),
          riskDetails: expect.objectContaining({ value: 'Aggressive neighbour' }),
        }),
      )
    })

    it('renders the flashed validation errors', async () => {
      req.flash = jest.fn().mockReturnValue([{ field: 'riskDetails', error: 'Backend says no' }])

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
    it('saves the answers, submits them and goes to the page after details of installation', async () => {
      req.body = { action: 'continue', hasOtherRisks: 'YES', riskDetails: 'Aggressive neighbour' }

      await controller.update(req, res, next)

      expect(service.saveOtherRisks).toHaveBeenCalledWith(req.order, {
        hasOtherRisks: 'YES',
        riskDetails: 'Aggressive neighbour',
      })
      expect(service.submit).toHaveBeenCalledWith({ accessToken: 'fakeUserToken', order: req.order })
      expect(taskListService.getNextPage).toHaveBeenCalledWith('DETAILS_OF_INSTALLATION', req.order)
      expect(res.redirect).toHaveBeenCalledWith(nextPage)
    })

    it('returns to the page with the errors when the submission is rejected', async () => {
      const backendErrors: ValidationResult = [{ error: 'Backend says no', field: 'riskDetails' }]
      service.submit.mockResolvedValue(backendErrors)
      req.body = { action: 'continue', hasOtherRisks: 'NO' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', backendErrors)
      expect(res.redirect).toHaveBeenCalledWith(otherRisksPath.replace(':orderId', req.order!.id))
    })

    it('returns to the page with the errors and saves nothing when the answers are invalid', async () => {
      req.body = { action: 'continue' }

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', [
        expect.objectContaining({
          error: 'Select yes if there are any other risks to be aware of',
          field: 'hasOtherRisks',
        }),
      ])
      expect(res.redirect).toHaveBeenCalledWith(otherRisksPath.replace(':orderId', req.order!.id))
      expect(service.saveOtherRisks).not.toHaveBeenCalled()
      expect(service.submit).not.toHaveBeenCalled()
    })
  })
})
