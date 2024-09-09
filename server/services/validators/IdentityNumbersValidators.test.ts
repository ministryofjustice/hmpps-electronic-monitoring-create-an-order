import { Request } from 'express'
import IdentityNumbersValidators from './IdentityNumbersValidators'

describe('Identity Numbers Validator', () => {
  let validator: IdentityNumbersValidators
  let req: Request
  beforeEach(() => {
    validator = new IdentityNumbersValidators()
    req = {
      // @ts-expect-error stubbing session
      session: { formData: { id: '1' } },
      query: {},
      body: {},
      user: {
        username: 'fakeUserName',
        token: 'fakeUserToken',
        authSource: 'auth',
      },
    }
  })

  describe('ValidateNomisId', () => {
    it('should return failed if nomis ID is undefined', () => {
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(false)
      expect(result.errors.nomisId.text).toEqual('Nomis ID must not be empty')
    })

    it('should return failed if nomis ID is empty', () => {
      req.body.nomisId = ''
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(false)
      expect(result.errors.nomisId.text).toEqual('Nomis ID must not be empty')
    })

    it('should assign nomis ID to session and return next path to pndId', () => {
      req.body.nomisId = 'mockNomisId'
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(true)
      expect(result.nextPath).toEqual('/section/identitynumbers/question/pndId')
      expect(req.session.formData.nomisId).toEqual('mockNomisId')
    })
  })

  describe('ValidatePndId', () => {
    it('should return failed if pnd Id is undefined', () => {
      const result = validator.ValidatePndID(req)
      expect(result.success).toEqual(false)
      expect(result.errors.pndId.text).toEqual('PND ID must not be empty')
    })

    it('should return failed if pnd Id is empty', () => {
      req.body.pndId = ''
      const result = validator.ValidatePndID(req)
      expect(result.success).toEqual(false)
      expect(result.errors.pndId.text).toEqual('PND ID must not be empty')
    })

    it('should assign pnd Id to session and return next path to section page', () => {
      req.body.pndId = 'mockPndId'
      const result = validator.ValidatePndID(req)
      expect(result.success).toEqual(true)
      expect(result.nextPath).toEqual('/section/1/identityNumbers')
      expect(req.session.formData.pndId).toEqual('mockPndId')
    })
  })
})
