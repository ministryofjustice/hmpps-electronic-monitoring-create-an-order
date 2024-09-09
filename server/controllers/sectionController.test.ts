import type { Request, Response } from 'express'
import SectionController from './sectionController'

describe('Section Controller', () => {
  let sectionController: SectionController
  let req: Request
  let res: Response

  beforeEach(() => {
    sectionController = new SectionController()

    req = {
      // @ts-expect-error stubbing session
      session: {},
      query: {},
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
      params: {
        sectionName: 'fakeSectionName',
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

  describe('getSection', () => {
    it('should render the expected section', async () => {
      await sectionController.getSection(req as Request, res as Response, null)
      expect(res.render).toHaveBeenCalledWith('pages/WIP', expect.objectContaining({}))
    })
  })
})
