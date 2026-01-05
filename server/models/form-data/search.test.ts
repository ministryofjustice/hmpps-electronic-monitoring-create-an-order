import { getMockOrder, createMonitoringConditions } from '../../../test/mocks/mockOrder'
import { constructSearchViewModel } from './search'
import { OrderStatusEnum } from '../Order'

describe('Search View Model', () => {
  describe('constructSearchViewModel', () => {
    describe('date inference from monitoring conditions', () => {
      it('should use monitoringConditions dates when no other conditions exist', () => {
        const mockDate1 = new Date(2024, 0, 15).toISOString()
        const mockDate2 = new Date(2024, 5, 30).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: mockDate1,
            endDate: mockDate2,
          }),
          curfewConditions: null,
          monitoringConditionsTrail: null,
          monitoringConditionsAlcohol: null,
          mandatoryAttendanceConditions: [],
          enforcementZoneConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('15/1/2024')
        expect(result.orders[0].endDate).toBe('30/6/2024')
      })

      it('should find earliest start date across all monitoring conditions', () => {
        const earliestDate = new Date(2024, 0, 1).toISOString()
        const middleDate = new Date(2024, 2, 15).toISOString()
        const latestDate = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: middleDate,
            endDate: latestDate,
          }),
          curfewConditions: {
            id: '1',
            startDate: earliestDate,
            endDate: middleDate,
            curfewAddress: null,
            curfewAdditionalDetails: null,
          },
          monitoringConditionsTrail: {
            id: '2',
            startDate: middleDate,
            endDate: latestDate,
          },
          mandatoryAttendanceConditions: [],
          monitoringConditionsAlcohol: null,
          enforcementZoneConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('1/1/2024')
      })

      it('should find latest end date across all monitoring conditions', () => {
        const earliestDate = new Date(2024, 0, 1).toISOString()
        const middleDate = new Date(2024, 5, 15).toISOString()
        const latestDate = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: earliestDate,
            endDate: middleDate,
          }),
          curfewConditions: {
            id: '1',
            startDate: earliestDate,
            endDate: latestDate,
            curfewAddress: null,
            curfewAdditionalDetails: null,
          },
          mandatoryAttendanceConditions: [],
          monitoringConditionsTrail: null,
          monitoringConditionsAlcohol: null,
          enforcementZoneConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].endDate).toBe('31/12/2024')
      })

      it('should include dates from enforcementZoneConditions array', () => {
        const earliestDate = new Date(2024, 0, 1).toISOString()
        const middleDate = new Date(2024, 5, 15).toISOString()
        const latestDate = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: middleDate,
            endDate: middleDate,
          }),
          enforcementZoneConditions: [
            {
              id: '0',
              startDate: earliestDate,
              endDate: middleDate,
              zoneId: 0,
              zoneType: null,
              description: null,
              duration: null,
              fileName: null,
              fileId: null,
            },
            {
              id: '1',
              startDate: middleDate,
              endDate: latestDate,
              zoneId: 1,
              zoneType: null,
              description: null,
              duration: null,
              fileName: null,
              fileId: null,
            },
          ],
          curfewConditions: null,
          monitoringConditionsTrail: null,
          monitoringConditionsAlcohol: null,
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('1/1/2024')
        expect(result.orders[0].endDate).toBe('31/12/2024')
      })

      it('should include dates from mandatoryAttendanceConditions array', () => {
        const earliestDate = new Date(2024, 0, 1).toISOString()
        const middleDate = new Date(2024, 5, 15).toISOString()
        const latestDate = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: middleDate,
            endDate: middleDate,
          }),
          mandatoryAttendanceConditions: [
            {
              id: '1',
              startDate: earliestDate,
              endDate: middleDate,
              purpose: null,
              appointmentDay: null,
              startTime: null,
              endTime: null,
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              postcode: null,
            },
            {
              id: '2',
              startDate: middleDate,
              endDate: latestDate,
              purpose: null,
              appointmentDay: null,
              startTime: null,
              endTime: null,
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              postcode: null,
            },
          ],
          curfewConditions: null,
          monitoringConditionsTrail: null,
          monitoringConditionsAlcohol: null,
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('1/1/2024')
        expect(result.orders[0].endDate).toBe('31/12/2024')
      })

      it('should include dates from alcoholMonitoring', () => {
        const earliestDate = new Date(2024, 0, 1).toISOString()
        const middleDate = new Date(2024, 5, 15).toISOString()
        const latestDate = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: middleDate,
            endDate: middleDate,
          }),
          monitoringConditionsAlcohol: {
            id: '1',
            monitoringType: 'ALCOHOL_LEVEL',
            startDate: earliestDate,
            endDate: latestDate,
          },
          curfewConditions: null,
          monitoringConditionsTrail: null,
          mandatoryAttendanceConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('1/1/2024')
        expect(result.orders[0].endDate).toBe('31/12/2024')
      })

      it('should handle null dates', () => {
        const validDate = new Date(2024, 5, 15).toISOString()

        const order = getMockOrder({
          status: OrderStatusEnum.Enum.SUBMITTED,
          monitoringConditions: createMonitoringConditions({
            startDate: validDate,
            endDate: validDate,
          }),
          curfewConditions: {
            id: '1',
            startDate: null,
            endDate: null,
            curfewAddress: null,
            curfewAdditionalDetails: null,
          },
          monitoringConditionsTrail: null,
          mandatoryAttendanceConditions: [],
          monitoringConditionsAlcohol: null,
          enforcementZoneConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('15/6/2024')
        expect(result.orders[0].endDate).toBe('15/6/2024')
      })

      it('should return empty strings when no dates exist', () => {
        const order = getMockOrder({
          status: OrderStatusEnum.Enum.SUBMITTED,
          monitoringConditions: createMonitoringConditions({
            startDate: null,
            endDate: null,
          }),
          curfewConditions: null,
          monitoringConditionsTrail: null,
          mandatoryAttendanceConditions: [],
          monitoringConditionsAlcohol: null,
          enforcementZoneConditions: [],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('')
        expect(result.orders[0].endDate).toBe('')
      })

      it('should find earliest and latest dates across all condition types', () => {
        const jan1 = new Date(2024, 0, 1).toISOString()
        const mar15 = new Date(2024, 2, 15).toISOString()
        const jun30 = new Date(2024, 5, 30).toISOString()
        const sep10 = new Date(2024, 8, 10).toISOString()
        const dec31 = new Date(2024, 11, 31).toISOString()

        const order = getMockOrder({
          status: 'SUBMITTED',
          monitoringConditions: createMonitoringConditions({
            startDate: mar15,
            endDate: jun30,
          }),
          curfewConditions: {
            id: '1',
            startDate: jan1,
            endDate: sep10,
            curfewAddress: null,
            curfewAdditionalDetails: null,
          },
          monitoringConditionsTrail: {
            id: '2',
            startDate: mar15,
            endDate: jun30,
          },
          monitoringConditionsAlcohol: {
            id: '3',
            monitoringType: 'ALCOHOL_ABSTINENCE',
            startDate: jun30,
            endDate: dec31,
          },
          mandatoryAttendanceConditions: [
            {
              id: '4',
              startDate: mar15,
              endDate: jun30,
              purpose: null,
              appointmentDay: null,
              startTime: null,
              endTime: null,
              addressLine1: null,
              addressLine2: null,
              addressLine3: null,
              addressLine4: null,
              postcode: null,
            },
          ],
          enforcementZoneConditions: [
            {
              id: '5',
              startDate: mar15,
              endDate: sep10,
              zoneId: 1,
              zoneType: null,
              description: null,
              duration: null,
              fileName: null,
              fileId: null,
            },
          ],
        })

        const result = constructSearchViewModel([order], 'test')

        expect(result.orders[0].startDate).toBe('1/1/2024')
        expect(result.orders[0].endDate).toBe('31/12/2024')
      })
    })
  })
})
