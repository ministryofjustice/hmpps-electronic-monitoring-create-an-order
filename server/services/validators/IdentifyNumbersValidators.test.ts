import { Request } from 'express'
import IdentifyNumbersValidators from './IdentifyNumbersValidators'

describe('Identify Numbers Validator', () => {
  let validator: IdentifyNumbersValidators
  let req: Request
  beforeEach(() => {
    validator = new IdentifyNumbersValidators()
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
    it('should return failed if nomis Id is undefined', () => {
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(false)
      expect(result.errors.nomisId.text).toEqual('Nomis ID must not be empty')
    })

    it('should return failed if nomis Id is empty', () => {
      req.body.nomisId = ''
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(false)
      expect(result.errors.nomisId.text).toEqual('Nomis ID must not be empty')
    })

    it('should assign nomis Id to session and return next path to pndId', () => {
      req.body.nomisId = 'mockNomisId'
      const result = validator.ValidateNomisId(req)
      expect(result.success).toEqual(true)
      expect(result.nextPath).toEqual('/section/identifynumbers/question/pndId')
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
      expect(result.nextPath).toEqual('/section/1/identifyNumbers')
      expect(req.session.formData.pndId).toEqual('mockPndId')
    })
  })
})
