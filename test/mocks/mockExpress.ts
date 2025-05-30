import type { Request, Response } from 'express'
import getContent from '../../server/i18n'
import { DataDictionaryVersions } from '../../server/types/i18n/dataDictionaryVersion'
import { Locales } from '../../server/types/i18n/locale'
import FeatureFlags from '../../server/utils/featureFlags'

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
      content: getContent(
        Locales.en,
        FeatureFlags.getInstance().get('DD_V5_1_ENABLED') ? DataDictionaryVersions.DDv5 : DataDictionaryVersions.DDv4,
      ),
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
