// eslint-disable-next-line import/prefer-default-export
export const formatAsFmsDateTime = (date: Date) => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day} 00:00:00`
}