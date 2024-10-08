import type { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Order, OrderStatus } from '../../models/Order'

export const createMockRequest = (order?: Order): Request => {
  return {
    // @ts-expect-error stubbing session
    session: {},
    query: {},
    params: {
      orderId: '123456789',
    },
    user: {
      username: '',
      token: '',
      authSource: '',
    },
    order,
  }
}

export const createMockResponse = (): Response => {
  // @ts-expect-error stubbing res.render
  return {
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
    redirect: jest.fn(),
    render: jest.fn(),
    set: jest.fn(),
    send: jest.fn(),
  }
}

export const createMockOrder = (status: OrderStatus): Order => {
  return {
    id: uuidv4(),
    status,
    deviceWearer: {
      nomisId: null,
      pncId: null,
      deliusId: null,
      prisonNumber: null,
      firstName: 'tester',
      lastName: 'testington',
      alias: 'test',
      dateOfBirth: '1980-01-01T00:00:00.000Z',
      adultAtTimeOfInstallation: false,
      sex: 'male',
      gender: 'male',
      disabilities: ['Vision', 'Mobilitiy'],
    },
    deviceWearerContactDetails: {
      contactNumber: '01234567890',
    },
    additionalDocuments: [],
  }
}
