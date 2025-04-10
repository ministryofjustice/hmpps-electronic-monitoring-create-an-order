export const formatAsFmsDateTime = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:00`
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
