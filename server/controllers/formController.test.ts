import type { Request, Response } from 'express'
import FormController from './formController'
import AuditService from '../services/auditService'

jest.mock('../services/AuditService')
describe('Form Controller', () => {
  let formController: FormController
  let mockAuditService: jest.Mocked<AuditService>
  beforeEach(() => {
    mockAuditService = new AuditService(null) as jest.Mocked<AuditService>
    formController = new FormController(mockAuditService)
  })
  const req: Request = {
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
  const res: Response = {
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

  describe('getForms', () => {
    it('should return list forms available to user', async () => {
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
})
