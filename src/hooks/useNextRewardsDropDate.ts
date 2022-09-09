import { dateToUnixTimestamp } from "../utils/date"

const rewardsDistributionDates = [
  // 15 July 2022 00:00:00 GTM
  1657843200,
  // 1 September 2022 00:00:00 GTM
  1661990400,
  // 1 October 2022 00:00:00 GTM
  1664582400,
  // 1 November 2022 00:00:00 GTM
  1667260800,
  // 1 December 2022 00:00:00 GTM
  1669852800,
]

export const useNextRewardsDropDate = () => {
  return rewardsDistributionDates.find(
    (nextDate) => dateToUnixTimestamp() < nextDate
  ) as number
}
