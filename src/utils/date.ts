export const ONE_SEC_IN_MILISECONDS = 1000
export const ONE_MINUTE_IN_SECONDS = 60
export const ONE_HOUR_IN_SECONDS = 3600
export const ONE_DAY_IN_SECONDS = 86400

export const dateToUnixTimestamp = (date: Date = new Date()) => {
  return Math.floor(date.getTime() / ONE_SEC_IN_MILISECONDS)
}

export const dateAs = (targetUnix: number) => {
  const days = Math.floor(targetUnix / ONE_DAY_IN_SECONDS)
  const hours = Math.floor(
    (targetUnix % ONE_DAY_IN_SECONDS) / ONE_HOUR_IN_SECONDS
  )
  const minutes = Math.floor(
    (targetUnix % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS
  )
  const seconds = Math.floor(targetUnix % ONE_MINUTE_IN_SECONDS)

  return { days, hours, minutes, seconds }
}
