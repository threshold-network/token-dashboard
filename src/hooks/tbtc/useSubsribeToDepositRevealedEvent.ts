import { useWeb3React } from "@web3-react/core"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useBridgeContract } from "./useBridgeContract"
import { tbtcSlice } from "../../store/tbtc"
import { BigNumber, Event } from "ethers"

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
      depositor: string,
      amount: BigNumber,
      blindingFactor: any,
      walletPubKeyHash: string,
      refundPubKeyHash: any,
      refundLocktime: any,
      vault: string,
      event: Event
    ) => {
      if (!account || !isSameETHAddress(depositor, account)) return

      dispatch(
        tbtcSlice.actions.depositRevealed({
          fundingOutputIndex,
          fundingTxHash,
          amount: amount.toString(),
          txHash: event.transactionHash,
          depositor: depositor,
        })
      )
    },
    [null, null, account]
  )
}
