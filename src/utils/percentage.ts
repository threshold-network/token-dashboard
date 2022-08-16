export const formatPercentage = (
  percentage: number,
  decimalPlaces: number = 0,
  displayLessThanGreaterThanSigns: boolean = false
): string => {
  if (percentage < 1 && displayLessThanGreaterThanSigns) {
    return "<1%"
  } else if (percentage > 99 && displayLessThanGreaterThanSigns) {
    return ">99%"
  }

  const roundedPercentage = percentage.toFixed(decimalPlaces)

  return `${roundedPercentage.toString()}%`
}
