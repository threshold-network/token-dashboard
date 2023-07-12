import { defaultAbiCoder } from "ethers/lib/utils"

export const isValidType = (paramType: string, value: string) => {
  try {
    defaultAbiCoder.encode([paramType], [value])
    return true
  } catch (error) {
    return false
  }
}
