import { createMockRequest, createMockResponse } from '../../test/mocks/mockExpress'
import populateContent from './populateContent'

describe('populateContent', () => {
  it('should populate res.locals with content', async () => {
    // Given
    const req = createMockRequest()
    const res = createMockResponse()
    const next = jest.fn()

    // When
    await populateContent(req, res, next)

    // Then
    expect(next).toHaveBeenCalled()
    expect(res.locals.content).not.toBeUndefined()
  })
})
