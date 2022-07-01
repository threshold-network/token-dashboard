import { useErc20TokenContract } from "./useERC20"
import { Token, TransactionType } from "../../enums"
import TBTC from "@keep-network/tbtc-v2/artifacts/TBTC.json"

export const useTBTCv2TokenContract = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    TBTC.address,
    undefined,
    TBTC.abi
  )

  // TODO:
  const approveTBTCV2 = () => {}

  const fetchTBTCV2Balance = () => {
    balanceOf(Token.TBTCV2)
  }

  return {
    fetchTBTCV2Balance,
    approveTBTCV2,
    contract,
  }
}
