import { dateToUnixTimestamp } from "@threshold-network/components"

export const useNextRewardsDropDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  return dateToUnixTimestamp(
    month === 11 ? new Date(year + 1, 0, 1) : new Date(year, month + 1, 1)
  )
}
