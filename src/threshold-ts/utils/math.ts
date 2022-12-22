import { BigNumber } from "ethers"

export const min = (a: string | number, b: string | number) => {
  return BigNumber.from(a).lt(b) ? a.toString() : b.toString()
}

export const max = (a: string | number, b: string | number) => {
  return BigNumber.from(a).gt(b) ? a.toString() : b.toString()
}
