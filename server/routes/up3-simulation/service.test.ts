import { randomUUID } from 'crypto'
import nock from 'nock'
import logger from '../../../logger'
import RestClient from '../../data/restClient'
import Up3SimulationService, { Up3SimulationError } from './service'

describe('Up3SimulationService', () => {
  const apiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  } as unknown as jest.Mocked<RestClient>
  const service = new Up3SimulationService(apiClient)
  const orderId = randomUUID()
  const versionId = randomUUID()
  const inspection = {
    orderId,
    currentOrderVersionId: versionId,
    currentOrderVersionNumber: 0,
    simulatedSubmissionVersionId: versionId,
    simulatedSubmissionVersionNumber: 0,
    caseId: `sim-${versionId}`,
    caseState: 'NEW',
    orderStatus: 'SUBMITTED',
    isOwner: true,
    canAmend: false,
    canControlSubmission: true,
    lastProcessedEventId: null,
    capturedUserEmails: 0,
    capturedNoEmails: 0,
  }

  beforeEach(() => jest.resetAllMocks())

  it('uses the logged-in user JWT without an additional key', async () => {
    apiClient.get.mockResolvedValue(inspection)

    expect(await service.inspect('user-jwt', orderId)).toEqual(inspection)
    expect(apiClient.get).toHaveBeenCalledWith({
      path: `/api/dev/up3-simulation/orders/${orderId}`,
      token: 'user-jwt',
      redactErrorDetails: true,
    })
  })

  it('sends both expected identities with state commands without retries', async () => {
    apiClient.put.mockResolvedValue(inspection)
    const command = {
      state: 'ACCEPTED' as const,
      expectedCurrentOrderVersionId: versionId,
      expectedSimulatedSubmissionVersionId: versionId,
    }

    await service.setState('user-jwt', orderId, command)

    expect(apiClient.put).toHaveBeenCalledWith(expect.objectContaining({ retry: false, data: command }))
  })

  it('preserves structured API codes without retaining error bodies or secrets', async () => {
    apiClient.get.mockRejectedValue({
      status: 403,
      message: 'user-jwt',
      data: { errorCode: 'UP3_SIMULATION_PERMISSION_DENIED', details: 'user-jwt' },
    })

    await expect(service.inspect('user-jwt', orderId)).rejects.toMatchObject({
      code: 'UP3_SIMULATION_PERMISSION_DENIED',
      status: 403,
      message: 'UP3 simulation request failed',
    })
  })

  it('treats malformed responses as unavailable rather than successful', async () => {
    apiClient.get.mockResolvedValue({ orderId })

    await expect(service.inspect('user-jwt', orderId)).rejects.toBeInstanceOf(Up3SimulationError)
  })

  it('does not log a user token reflected by a failing API response', async () => {
    const warn = jest.spyOn(logger, 'warn').mockImplementation(() => undefined)
    const info = jest.spyOn(logger, 'info').mockImplementation(() => undefined)
    const realClient = new RestClient('simulation', {
      url: 'http://simulation.test',
      timeout: { response: 1000, deadline: 2000 },
      agent: { timeout: 1000 },
    })
    nock('http://simulation.test')
      .get(`/api/dev/up3-simulation/orders/${orderId}`)
      .matchHeader('Authorization', 'Bearer user-jwt')
      .reply(403, { errorCode: 'UP3_SIMULATION_PERMISSION_DENIED', message: 'user-jwt' }, { 'X-Debug': 'user-jwt' })
    try {
      await expect(new Up3SimulationService(realClient).inspect('user-jwt', orderId)).rejects.toMatchObject({
        code: 'UP3_SIMULATION_PERMISSION_DENIED',
        status: 403,
      })
      expect(JSON.stringify([...warn.mock.calls, ...info.mock.calls])).not.toContain('user-jwt')
      expect(warn).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }), expect.any(String))
    } finally {
      warn.mockRestore()
      info.mockRestore()
      realClient.agent.destroy()
      nock.cleanAll()
    }
  })

  it('sanitises malformed field-error lists and discards reflected secrets', async () => {
    apiClient.get.mockRejectedValue({
      status: 400,
      data: [null, 'bad', { error: 'Correct the date' }, { error: 'user-jwt' }],
    })
    await expect(service.inspect('user-jwt', orderId)).rejects.toMatchObject({
      fieldErrors: [{ text: 'Correct the date', href: '#main-content' }],
      code: 'UP3_SIMULATION_VALIDATION_FAILED',
    })
  })
})
