export const ONE_SEC_IN_MILISECONDS = 1000
export const ONE_MINUTE_IN_SECONDS = 60
export const ONE_HOUR_IN_SECONDS = 3600
export const ONE_DAY_IN_SECONDS = 86400
export const ONE_WEEK_IN_SECONDS = ONE_DAY_IN_SECONDS * 7
export const ONE_MONTH_IN_SECONDS = ONE_DAY_IN_SECONDS * 30
export const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS * 365

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

export const formatDate = (
  timestamp: string | number,
  locales: Intl.LocalesArgument = "en-gb",
  options?: Intl.DateTimeFormatOptions
) =>
  new Date(+timestamp * ONE_SEC_IN_MILISECONDS).toLocaleDateString(
    locales,
    options
  )

// unit, max diff, divisor
const unitsToDivisor: [Intl.RelativeTimeFormatUnit, number, number][] = [
  ["second", ONE_MINUTE_IN_SECONDS, 1],
  ["minute", ONE_HOUR_IN_SECONDS, ONE_MINUTE_IN_SECONDS],
  ["hour", ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS],
  ["day", ONE_WEEK_IN_SECONDS, ONE_DAY_IN_SECONDS],
  ["week", ONE_MONTH_IN_SECONDS, ONE_WEEK_IN_SECONDS],
  ["month", ONE_YEAR_IN_SECONDS, ONE_MONTH_IN_SECONDS],
  ["year", Infinity, ONE_YEAR_IN_SECONDS],
]
const rtf = new Intl.RelativeTimeFormat("en-gb", { style: "short" })

export const getRelativeTime = (dateOrUnixTimestamp: Date | number): string => {
  const time =
    typeof dateOrUnixTimestamp === "number"
      ? dateOrUnixTimestamp
      : dateToUnixTimestamp(dateOrUnixTimestamp)

  const diff = Math.round(time - dateToUnixTimestamp())

  const [unit, , divisor] =
    unitsToDivisor.find(([, maxDiff]) => maxDiff > Math.abs(diff)) ??
    unitsToDivisor[0]

  return rtf.format(Math.floor(diff / divisor), unit)
}
