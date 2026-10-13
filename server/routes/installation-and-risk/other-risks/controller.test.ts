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
  const validationErrors: ValidationResult = [
    { error: 'Select the possible risks', field: 'possibleRisk', focusTarget: 'possibleRisk' },
  ]

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
    it('renders the other risks page', async () => {
      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/WIP', { pageName: 'Other risks', errorSummary: null })
    })

    it('shows the errors from submitting the risks', async () => {
      req.flash = jest.fn().mockReturnValue(validationErrors)

      await controller.view(req, res, next)

      expect(res.render).toHaveBeenCalledWith(
        'pages/WIP',
        expect.objectContaining({
          errorSummary: {
            titleText: 'There is a problem',
            errorList: [{ href: '#possibleRisk', text: 'Select the possible risks' }],
          },
        }),
      )
    })
  })

  describe('update', () => {
    beforeEach(() => {
      req.body = { action: 'continue' }
    })

    it('submits the cached risks for the order', async () => {
      await store.updateField(req.order!, 'possibleRisk', ['THREATS_OF_VIOLENCE'])
      await store.updateField(req.order!, 'riskCategory', ['DANGEROUS_ANIMALS'])

      await controller.update(req, res, next)

      expect(detailsOfInstallationService.updateDetailsOfInstallation).toHaveBeenCalledWith({
        accessToken: 'fakeUserToken',
        orderId: req.order!.id,
        data: {
          possibleRisk: ['THREATS_OF_VIOLENCE'],
          riskCategory: ['DANGEROUS_ANIMALS'],
          riskDetails: '',
          genderRiskDetails: '',
        },
      })
    })

    it('goes to the page after details of installation', async () => {
      await controller.update(req, res, next)

      expect(taskListService.getNextPage).toHaveBeenCalledWith('DETAILS_OF_INSTALLATION', req.order)
      expect(res.redirect).toHaveBeenCalledWith(nextPage)
    })

    it('returns to the other risks page with the errors when the risks are invalid', async () => {
      detailsOfInstallationService.updateDetailsOfInstallation.mockResolvedValue(validationErrors)

      await controller.update(req, res, next)

      expect(req.flash).toHaveBeenCalledWith('validationErrors', validationErrors)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.INSTALLATION_AND_RISK.OTHER_RISKS.replace(':orderId', req.order!.id),
      )
    })
  })
})
