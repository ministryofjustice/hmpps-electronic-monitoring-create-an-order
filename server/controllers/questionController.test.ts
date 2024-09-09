import type { Request, Response } from 'express'
import QuestionController from './questionController'
import InputValidator from '../services/inputValidator'

describe('Question Controller', () => {
  let questionController: QuestionController
  let req: Request
  let res: Response
  beforeEach(() => {
    questionController = new QuestionController()

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      params: {},
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
      redirect: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    }
  })

  describe('getSection', () => {
    it('should return section detail page with formdata from session', async () => {
      req.params.sectionName = 'mockSection'
      req.params.questionName = 'mockQuestion'
      req.session.formData = { id: '1', nomisId: 'mockId' }
      await questionController.getSection(req, res, null)
      expect(res.render).toHaveBeenCalledWith(
        'pages/sections/mockSection/mockQuestion',
        expect.objectContaining({
          formData: { id: '1', nomisId: 'mockId' },
        }),
      )
      expect(req.session.returnTo).toEqual('pages/sections/mockSection/mockQuestion')
    })
  })

  describe('postNext', () => {
    it('should return original page with error if validator failed', async () => {
      req.session.formData = { id: '1', nomisId: 'mockId' }
      req.session.returnTo = 'pages/sections/mockSection/mockQuestion'
      InputValidator.validateInput = jest
        .fn()
        .mockReturnValue({ success: false, errors: { mockInput: 'mockError' }, nextPath: '' })
      await questionController.postNext(req, res, null)
      expect(res.render).toHaveBeenCalledWith(
        'pages/sections/mockSection/mockQuestion',
        expect.objectContaining({
          error: { mockInput: 'mockError' },
          formData: { id: '1', nomisId: 'mockId' },
        }),
      )
    })

    it('should redirect to next page if validator succeeded', async () => {
      req.session.formData = { id: '1', nomisId: 'mockId' }
      req.session.returnTo = 'pages/sections/mockSection/mockQuestion'
      InputValidator.validateInput = jest
        .fn()
        .mockReturnValue({ success: true, errors: {}, nextPath: '/mock/next/page' })
      await questionController.postNext(req, res, null)
      expect(res.redirect).toHaveBeenCalledWith('/mock/next/page')
    })
  })
})
