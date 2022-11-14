export const ONE_SEC_IN_MILISECONDS = 1000

export const dateToUnixTimestamp = (date: Date = new Date()) => {
  return Math.floor(date.getTime() / ONE_SEC_IN_MILISECONDS)
}
