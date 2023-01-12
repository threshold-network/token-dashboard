import { useWeb3React } from "@web3-react/core"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useBridgeContract } from "./useBridgeContract"

export const useSubscribeToDepositRevealedEvent = () => {
  const contract = useBridgeContract()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useSubscribeToContractEvent(
    contract,
    "DepositRevealed",
    //@ts-ignore
    async (
      fundingTxHash: string,
      fundingOutputIndex: number,
      depositor: string
    ) => {
      if (account && isSameETHAddress(depositor, account)) {
        console.log("Deposit revealed!!")
        console.log("FUNDING TX HASH: ", fundingTxHash)
        console.log("FUNDING TX OUTPUT: ", fundingOutputIndex)
        console.log("depositor", account)
      }
    },
    [null, null, account]
  )
}
