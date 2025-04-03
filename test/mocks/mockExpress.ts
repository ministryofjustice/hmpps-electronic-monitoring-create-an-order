import type { Request, Response } from 'express'
import i18n from '../../server/i18n'

export const createMockRequest = (
  overrideProperties: Partial<Request> = { params: { orderId: '123456789' } },
): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {},
    user: {
      username: '',
      token: '',
      authSource: '',
    },
    ...overrideProperties,
  }
}

export const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
    locals: {
      content: i18n.en,
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
    redirect: jest.fn(),
    render: jest.fn(),
    set: jest.fn(),
    send: jest.fn(),
  }
}
