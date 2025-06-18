export const formatAsFmsDate = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatAsFmsDateTime = (date: Date, hour?: number, minute?: number) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = hour || date.getHours()
  const hoursString = hours.toString().padStart(2, '0')
  const minutes = minute || date.getMinutes()
  const minuteString = minutes.toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hoursString}:${minuteString}:00`
}

export const stripWhitespace = (str: string) => str.split(/\s+/).join('')

// Serco expects phone numbers to be formatted according to International Direct Dialling format
// e.g. 00 44 20 7946 0000
export const formatAsFmsPhoneNumber = (phoneNumber: string) => {
  const prefix = '00'
  const countryCode = '44'
  const nationalSignificantNumber = stripWhitespace(phoneNumber.slice(1))

  return `${prefix}${countryCode}${nationalSignificantNumber}`
}
