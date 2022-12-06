export const range = (size: number, startAt = 0) => {
  return Array.from(Array(size).keys()).map((i) => i + startAt)
}
