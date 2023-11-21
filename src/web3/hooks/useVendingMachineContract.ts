import { UpgredableToken } from "../../types"
import { Token } from "../../enums"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useVendingMachineContract = (token: UpgredableToken) => {
  const threshold = useThreshold()

  const TOKEN_TO_VENDING_MACHINE_CONTRACT = {
    [Token.Keep]: threshold.vendingMachines.keep.contract,
    [Token.Nu]: threshold.vendingMachines.nu.contract,
  }

  return TOKEN_TO_VENDING_MACHINE_CONTRACT[token]
}
