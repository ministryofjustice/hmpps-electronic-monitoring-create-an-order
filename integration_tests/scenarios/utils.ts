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

export function stubPdfAttachments(
  files: {
    licence: { fileName: string; contents: string }
  },
  fmsCaseId: string,
  hmppsDocumentId: string,
  variation: boolean = false,
) {
  cy.task('stubFmsUploadAttachment', {
    httpStatus: 200,
    fileName: files.licence.fileName,
    deviceWearerId: fmsCaseId,
    response: {
      status: 200,
      result: {},
    },
  })

  cy.task('stubUploadDocument', {
    id: '(.*)',
    httpStatus: 200,
    response: {
      documentUuid: hmppsDocumentId,
      documentFilename: files.licence.fileName,
      filename: files.licence.fileName,
      fileExtension: files.licence.fileName.split('.')[1],
      mimeType: 'application/pdf',
    },
  })

  cy.readFile(files.licence.contents, 'base64').then(content => {
    cy.task('stubGetDocument', {
      id: '(.*)',
      httpStatus: 200,
      contextType: 'image/pdf',
      fileBase64Body: content,
    })
  })

  if (variation) {
    cy.task('stubFmsUploadVariationAttachment', {
      httpStatus: 200,
      fileName: files.licence.fileName,
      deviceWearerId: fmsCaseId,
      response: {
        status: 200,
        result: {},
      },
    })
  }
}
