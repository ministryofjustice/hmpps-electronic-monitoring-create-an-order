const apiDayCodes = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const asJSONDayResponse = (
  day: string | string[],
  orderId: string,
  startTime: string,
  endTime: string,
  addresses: string | string[],
) => {
  const days = Array.isArray(day) ? day : [day]
  const curfewAddress = (Array.isArray(addresses) ? addresses : [addresses]).join(',')

  return days.map((dayCode: string) => {
    return { dayOfWeek: dayCode, orderId, curfewAddress, startTime, endTime }
  })
}
const asJSONNightResponse = (
  day: string | string[],
  orderId: string,
  startTime: string,
  endTime: string,
  addresses: string | string[],
) => {
  const days = Array.isArray(day) ? day : [day]
  const curfewAddress = (Array.isArray(addresses) ? addresses : [addresses]).join(',')

  const response = days.flatMap((dayOfWeek: string) => {
    const i = apiDayCodes.indexOf(dayOfWeek)
    const nextDayOfWeek = i < apiDayCodes.length - 1 ? apiDayCodes[i + 1] : apiDayCodes[0]

    return [
      { dayOfWeek, orderId, curfewAddress, startTime, endTime: '23:59:00' },
      { dayOfWeek: nextDayOfWeek, orderId, curfewAddress, startTime: '00:00:00', endTime },
    ]
  })

  const grouped = response.reduce((out, entry) => {
    if (out[entry.dayOfWeek]) {
      out[entry.dayOfWeek].push(entry)
      return out
    }

    return {
      ...out,
      [entry.dayOfWeek]: [entry],
    }
  }, {})

  return Object.keys(grouped).flatMap((dayOfWeek: string) => grouped[dayOfWeek])
}

const weekendOnly = (
  orderId: string,
  startTime: string = '07:00:00',
  endTime: string = '19:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONDayResponse(['SATURDAY', 'SUNDAY'], orderId, startTime, endTime, addresses)

const weekendNightsOnly = (
  orderId: string,
  startTime: string = '19:00:00',
  endTime: string = '07:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONNightResponse(['SATURDAY', 'SUNDAY'], orderId, startTime, endTime, addresses)

const weekdaysOnly = (
  orderId: string,
  startTime: string = '07:00:00',
  endTime: string = '19:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONDayResponse(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], orderId, startTime, endTime, addresses)

const weekNightsOnly = (
  orderId: string,
  startTime: string = '19:00:00',
  endTime: string = '07:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) =>
  asJSONNightResponse(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], orderId, startTime, endTime, addresses)

const singleDay = (
  day: string,
  orderId: string,
  startTime: string = '07:00:00',
  endTime: string = '19:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONDayResponse(day, orderId, startTime, endTime, addresses)

const singleNight = (
  day: string,
  orderId: string,
  startTime: string = '19:00:00',
  endTime: string = '07:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONNightResponse(day, orderId, startTime, endTime, addresses)

const multiDays = (
  days: string[],
  orderId: string,
  startTime: string = '07:00:00',
  endTime: string = '19:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONDayResponse(days, orderId, startTime, endTime, addresses)

const multiNights = (
  days: string[],
  orderId: string,
  startTime: string = '19:00:00',
  endTime: string = '07:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONNightResponse(days, orderId, startTime, endTime, addresses)

const allDays = (
  orderId: string,
  startTime: string = '07:00:00',
  endTime: string = '19:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONDayResponse(apiDayCodes, orderId, startTime, endTime, addresses)

const allNights = (
  orderId: string,
  startTime: string = '19:00:00',
  endTime: string = '07:00:00',
  addresses: string | string[] = 'PRIMARY_ADDRESS',
) => asJSONNightResponse(apiDayCodes, orderId, startTime, endTime, addresses)

export default {
  weekendOnly,
  weekdaysOnly,
  singleDay,
  multiDays,
  allDays,

  weekendNightsOnly,
  weekNightsOnly,
  singleNight,
  multiNights,
  allNights,
}
