import type { Request, Response } from 'express'
import getContent from '../../server/i18n'
import { Locales } from '../../server/types/i18n/locale'
import { Order } from '../../server/models/Order'
import FeatureFlags from '../../server/utils/featureFlags'
import { getMockOrder } from './mockOrder'

export const createMockRequest = (
  overrideProperties: Partial<Request> = {
    params: {
      orderId: '123456789',
    },
  },
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
    order: getMockOrder(),
    ...overrideProperties,
  }
}

export const createMockResponse = (order?: Order): Response => {
  // @ts-expect-error stubbing res.render

  return {
    locals: {
      content: getContent(Locales.en, order?.dataDictionaryVersion ?? 'DDV4'),
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
