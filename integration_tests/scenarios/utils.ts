// eslint-disable-next-line import/prefer-default-export
export const formatAsFmsDateTime = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`
}
