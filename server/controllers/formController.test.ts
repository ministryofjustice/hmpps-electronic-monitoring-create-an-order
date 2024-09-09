import type { Request, Response } from 'express'
import FormController from './formController'
import AuditService from '../services/auditService'

jest.mock('../services/auditService')
describe('Form Controller', () => {
  let formController: FormController
  let mockAuditService: jest.Mocked<AuditService>
  let req: Request
  let res: Response
  beforeEach(() => {
    mockAuditService = new AuditService(null) as jest.Mocked<AuditService>
    formController = new FormController(mockAuditService)

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
    }
    // @ts-expect-error stubbing res.render
    res = {
      locals: {
        user: {
          username: 'fakeUserName',
          token: 'fakeUserToken',
          authSource: 'nomis',
          userId: 'fakeId',
          name: 'fake user',
          displayName: 'fuser',
          userRoles: ['fakeRole'],
          staffId: 123,
        },
      },
      render: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    }
  })

  describe('getForms', () => {
    it('should return a list of forms available to the user', async () => {
      await formController.getForms(req, res, null)
      expect(res.render).toHaveBeenCalledWith(
        'pages/index',
        expect.objectContaining({
          orderList: [
            { title: 'Test Form 1', status: 'Draft' },
            { title: 'Test Form 2', status: 'Draft' },
            { title: 'Test Form 3', status: 'Draft' },
            { title: 'Test Form 4', status: 'Submitted' },
            { title: 'Test Form 5', status: 'Submitted' },
          ],
        }),
      )
    })
  })

  describe('getNewFormPage', () => {
    it('should redirect to new form page', () => {
      formController.getNewFormPage(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/newForm')
    })
  })

  describe('postNewForm', () => {
    it('should redirect to hdc start page when formType is HDC', () => {
      req.body = { formType: 'HDC' }
      formController.postNewForm(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/hdc')
    })

    it('should redirect to WIP page', () => {
      req.body = { formType: 'notHDC' }
      formController.postNewForm(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/WIP')
    })
  })

  describe('createForm', () => {
    it('should log audit event', async () => {
      req.body = { formType: 'HDC' }
      await formController.createForm(req, res, null)
      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        who: 'fakeUserName',
        correlationId: req.id,
        what: 'Create new electronic monitoring form',
      })
    })

    it('should redirect to hdc start page when formType is HDC', async () => {
      req.body = { formType: 'HDC' }
      await formController.createForm(req, res, null)
      expect(res.render).toHaveBeenCalledWith(
        'pages/details',
        expect.objectContaining({
          form: {
            id: '1',
            title: 'Home Detention Curfew (HDC) form',
            sections: [
              { ref: '/section/abc/identityNumbers', description: 'Identity numbers', isComplete: true },
              { ref: 'x', description: 'About the device wearer', isComplete: false },
              { ref: 'x', description: 'About the HDC', isComplete: false },
              { ref: 'x', description: 'Other monitoring conditions', isComplete: false },
              { ref: 'x', description: 'Installations and risk information', isComplete: false },
              { ref: 'x', description: 'About organisations', isComplete: false },
            ],
          },
        }),
      )
    })

    it('should redirect to WIP page', async () => {
      req.body = { formType: 'notHDC' }
      await formController.createForm(req, res, null)
      expect(res.render).toHaveBeenCalledWith('pages/WIP')
    })
  })
})
