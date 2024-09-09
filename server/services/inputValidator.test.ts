import { Request } from 'express'
import IdentityNumbersValidators from './validators/IdentityNumbersValidators'
import InputValidator from './inputValidator'
import { SectionValidator } from '../interfaces/inputValidation'

describe('Input Validator', () => {
  let req: Request
  let sectionValidator: jest.Mocked<SectionValidator>
  beforeEach(() => {
    sectionValidator = new IdentityNumbersValidators() as jest.Mocked<SectionValidator>
    InputValidator.validators = {
      mockSection: sectionValidator,
    }
    req = {
      // @ts-expect-error stubbing session
      session: { formData: { id: '1' }, returnTo: 'pages/sections/mockSection/mockQuestion' },
      query: {},
      body: {},
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
    }
  })

  describe('validateInput', () => {
    it('Return failed if section validator not exist', () => {
      req.session.returnTo = 'pages/sections/otherSection/mockQuestion'
      const result = InputValidator.validateInput(req)
      expect(result.success).toEqual(false)
    })

    it('Return failed if question validator not exist', () => {
      sectionValidator.questionValidators = {}
      req.session.returnTo = 'pages/sections/mockSection/otherQuestion'
      const result = InputValidator.validateInput(req)
      expect(result.success).toEqual(false)
    })

    it('Return question validator result', () => {
      sectionValidator.questionValidators = {
        mockQuestion: () => {
          return { success: true }
        },
      }
      req.session.returnTo = 'pages/sections/mockSection/mockQuestion'
      const result = InputValidator.validateInput(req)
      expect(result.success).toEqual(true)
    })
  })
})
