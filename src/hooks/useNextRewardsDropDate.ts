import { dateToUnixTimestamp } from "../utils/date"

const rewardsDistributionDates = [1657843200, 1661990400]

export const useNextRewardsDropDate = () => {
  return rewardsDistributionDates.find(
    (nextDate) => dateToUnixTimestamp() < nextDate
  ) as number
}
